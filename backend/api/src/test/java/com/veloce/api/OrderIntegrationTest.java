package com.veloce.api;

import com.veloce.api.entity.Car;
import com.veloce.api.repository.CarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Exercises the real order-creation path against a real Postgres instance —
 * unlike {@link com.veloce.api.service.OrderServiceTest}, which mocks the
 * repository, this proves the pessimistic-lock inventory guarantee actually
 * holds under concurrent requests.
 */
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
class OrderIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CarRepository carRepository;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/v1";
    }

    private String registerAndLogin(String email) {
        Map<String, Object> registerPayload = Map.of(
                "name", "Test Buyer",
                "email", email,
                "password", "password123"
        );
        restTemplate.postForEntity(baseUrl + "/auth/register", registerPayload, Map.class);

        Map<String, Object> loginPayload = Map.of("email", email, "password", "password123");
        ResponseEntity<Map> loginResponse =
                restTemplate.postForEntity(baseUrl + "/auth/login", loginPayload, Map.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        return (String) loginResponse.getBody().get("token");
    }

    private ResponseEntity<Map> placeOrder(String token, Long carId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        // Force a fresh socket per request — the JDK's HttpURLConnection
        // keep-alive pool is shared process-wide by host:port, so two truly
        // concurrent requests can otherwise race on a reused connection.
        headers.setConnection("close");

        Map<String, Object> item = Map.of("carId", carId, "variant", "Standard", "quantity", 1);
        Map<String, Object> payload = Map.of(
                "items", java.util.List.of(item),
                "shippingName", "Test Buyer",
                "shippingEmail", "buyer@example.com",
                "shippingPhone", "0400000000",
                "shippingAddress", "1 Test Street",
                "shippingCity", "Brisbane",
                "shippingState", "QLD",
                "shippingPincode", "4000"
        );

        // A fresh RestTemplate per call avoids any connection-reuse surprises
        // when two requests are fired truly concurrently against the same host.
        // A no-op error handler lets us inspect 4xx/5xx responses directly,
        // matching TestRestTemplate's default lenient behavior.
        RestTemplate client = new RestTemplate();
        client.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            public boolean hasError(org.springframework.http.client.ClientHttpResponse response) throws java.io.IOException {
                return false;
            }
        });
        return client.postForEntity(baseUrl + "/orders", new HttpEntity<>(payload, headers), Map.class);
    }

    @Test
    void registrationAndLoginIssueARealJwt() {
        String token = registerAndLogin("auth-flow@example.com");
        assertThat(token).isNotBlank();
    }

    @Test
    void concurrentOrdersOnSingleUnitOfStockNeverOversell() throws Exception {
        Car car = carRepository.save(Car.builder()
                .name("One-Off Hypercar")
                .brand("Veloce")
                .category(Car.Category.SUPERCARS)
                .price(new BigDecimal("500000"))
                .stock(1)
                .inStock(true)
                .build());

        String tokenA = registerAndLogin("buyer-a@example.com");
        String tokenB = registerAndLogin("buyer-b@example.com");

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Callable<ResponseEntity<Map>> requestA = () -> placeOrder(tokenA, car.getId());
        Callable<ResponseEntity<Map>> requestB = () -> placeOrder(tokenB, car.getId());

        Future<ResponseEntity<Map>> futureA = executor.submit(requestA);
        Future<ResponseEntity<Map>> futureB = executor.submit(requestB);

        ResponseEntity<Map> responseA = futureA.get(15, TimeUnit.SECONDS);
        ResponseEntity<Map> responseB = futureB.get(15, TimeUnit.SECONDS);
        executor.shutdown();

        java.util.List<HttpStatus> statuses = java.util.List.of(
                HttpStatus.valueOf(responseA.getStatusCode().value()),
                HttpStatus.valueOf(responseB.getStatusCode().value())
        );

        assertThat(statuses).containsExactlyInAnyOrder(HttpStatus.OK, HttpStatus.CONFLICT);

        Car finalCar = carRepository.findById(car.getId()).orElseThrow();
        assertThat(finalCar.getStock()).isZero();
    }
}
