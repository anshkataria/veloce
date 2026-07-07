package com.veloce.api;

import com.veloce.api.repository.CarRepository;
import com.veloce.api.repository.OrderRepository;
import com.veloce.api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties = {
		"spring.autoconfigure.exclude=" +
				"org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration," +
				"org.springframework.boot.data.jpa.autoconfigure.DataJpaRepositoriesAutoConfiguration," +
				"org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration"
})
class ApiApplicationTests {

	@MockitoBean
	private UserRepository userRepository;

	@MockitoBean
	private CarRepository carRepository;

	@MockitoBean
	private OrderRepository orderRepository;

	@Test
	void contextLoads() {
	}

}
