package com.veloce.api.config;

import com.veloce.api.entity.Car;
import com.veloce.api.entity.User;
import com.veloce.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.veloce.api.repository.CarRepository;
import java.util.List;
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CarRepository carRepository;
    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@veloce.in")) {
            User admin = User.builder()
                    .name("Veloce Admin")
                    .email("admin@veloce.in")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@veloce.in / admin123");
        }
        if (carRepository.count() < 8) {
            carRepository.deleteAll();
            List<Car> cars = List.of(
                    Car.builder()
                            .name("Lamborghini Huracán EVO")
                            .brand("Lamborghini")
                            .category(Car.Category.SUPERCARS)
                            .price(new java.math.BigDecimal("32500000"))
                            .originalPrice(new java.math.BigDecimal("35000000"))
                            .description("5.2L V10 naturally aspirated engine producing 630 hp. 0–100 km/h in 2.9 seconds.")
                            .variants("Standard,Spyder")
                            .stock(2).inStock(true).isNew(true)
                            .imageUrl("https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("Mercedes-AMG GT Black Series")
                            .brand("Mercedes-AMG")
                            .category(Car.Category.SUPERCARS)
                            .price(new java.math.BigDecimal("28900000"))
                            .originalPrice(new java.math.BigDecimal("30000000"))
                            .description("4.0L biturbo V8, 730 hp. The most powerful AMG production car ever built.")
                            .variants("Standard")
                            .stock(1).inStock(true).isNew(false)
                            .imageUrl("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("Porsche 911 GT3 RS")
                            .brand("Porsche")
                            .category(Car.Category.SPORTSCARS)
                            .price(new java.math.BigDecimal("23500000"))
                            .originalPrice(new java.math.BigDecimal("25000000"))
                            .description("4.0L flat-six, 525 hp, naturally aspirated. The purist's choice.")
                            .variants("Coupe")
                            .stock(3).inStock(true).isNew(true)
                            .imageUrl("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("Ferrari SF90 Stradale")
                            .brand("Ferrari")
                            .category(Car.Category.SUPERCARS)
                            .price(new java.math.BigDecimal("55000000"))
                            .originalPrice(new java.math.BigDecimal("58000000"))
                            .description("Hybrid V8, 1000 hp total system output. Ferrari's most powerful road car.")
                            .variants("Coupe,Spider")
                            .stock(0).inStock(false).isNew(false)
                            .imageUrl("https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("BMW M4 Competition")
                            .brand("BMW")
                            .category(Car.Category.SPORTSCARS)
                            .price(new java.math.BigDecimal("9800000"))
                            .originalPrice(new java.math.BigDecimal("10500000"))
                            .description("3.0L inline-six twin-turbo, 510 hp. Daily driver meets track weapon.")
                            .variants("Coupe,Convertible,xDrive")
                            .stock(5).inStock(true).isNew(false)
                            .imageUrl("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("Rolls-Royce Ghost")
                            .brand("Rolls-Royce")
                            .category(Car.Category.LUXURY)
                            .price(new java.math.BigDecimal("68000000"))
                            .originalPrice(new java.math.BigDecimal("70000000"))
                            .description("6.75L twin-turbo V12, 563 hp. The definitive luxury saloon.")
                            .variants("Standard,Extended")
                            .stock(1).inStock(true).isNew(false)
                            .imageUrl("https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("Aston Martin DB12")
                            .brand("Aston Martin")
                            .category(Car.Category.LUXURY)
                            .price(new java.math.BigDecimal("26500000"))
                            .originalPrice(new java.math.BigDecimal("28000000"))
                            .description("4.0L twin-turbo V8, 671 hp. British elegance meets supercar performance.")
                            .variants("Coupe,Volante")
                            .stock(2).inStock(true).isNew(true)
                            .imageUrl("https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&q=80")
                            .build(),
                    Car.builder()
                            .name("McLaren 720S")
                            .brand("McLaren")
                            .category(Car.Category.SUPERCARS)
                            .price(new java.math.BigDecimal("29500000"))
                            .originalPrice(new java.math.BigDecimal("31000000"))
                            .description("4.0L twin-turbo V8, 720 hp. Carbon fibre MonoCell II chassis.")
                            .variants("Coupe,Spider")
                            .stock(1).inStock(true).isNew(false)
                            .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80")
                            .build()
            );
            carRepository.saveAll(cars);
            log.info("Seeded {} cars", cars.size());
        }
    }
}