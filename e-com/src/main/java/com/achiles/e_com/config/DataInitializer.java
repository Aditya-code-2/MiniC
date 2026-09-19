package com.achiles.e_com.config;

import com.achiles.e_com.entity.User;
import com.achiles.e_com.entity.Category;
import com.achiles.e_com.entity.Product;
import com.achiles.e_com.repository.UserRepository;
import com.achiles.e_com.repository.CategoryRepository;
import com.achiles.e_com.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:adityakumar909763@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123SecurePass}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        User admin = null;
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            admin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword)) // Password hashed before saving
                    .role(User.Role.ROLE_ADMIN)
                    .build();

            admin = userRepository.save(admin);
            System.out.println("✅ Initial Admin user created successfully.");
        } else {
            admin = userRepository.findByEmail(adminEmail).get();
        }

        // Seed Categories and Products
        if (!categoryRepository.existsByName("Action Figures")) {
            Category actionFigures = Category.builder().name("Action Figures").slug("action-figures").description("Awesome action figures").build();
            Category dolls = Category.builder().name("Dolls & Playsets").slug("dolls-playsets").description("Beautiful dolls and sets").build();
            Category educational = Category.builder().name("Educational Toys").slug("educational-toys").description("Learn while playing").build();
            Category boardGames = Category.builder().name("Board Games").slug("board-games").description("Fun for the whole family").build();
            Category rcToys = Category.builder().name("RC Toys").slug("rc-toys").description("Remote control cars and drones").build();

            categoryRepository.saveAll(Arrays.asList(actionFigures, dolls, educational, boardGames, rcToys));
            System.out.println("✅ Initial Categories created successfully.");

            if (productRepository.count() <= 10) {
                List<Product> products = Arrays.asList(
                        Product.builder().category(actionFigures).name("Superhero Action Figure").slug("superhero-action-figure").description("Posable superhero figure with accessories.").price(new BigDecimal("999.00")).stockQuantity(50).seller(admin).imageUrl("https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(actionFigures).name("Ninja Warrior Set").slug("ninja-warrior-set").description("Complete ninja warrior action figure set.").price(new BigDecimal("1299.00")).stockQuantity(30).seller(admin).imageUrl("https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(dolls).name("Princess Doll House").slug("princess-doll-house").description("Large wooden princess doll house.").price(new BigDecimal("2999.00")).stockQuantity(15).seller(admin).imageUrl("https://images.unsplash.com/photo-1558066120-e7912613d967?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(dolls).name("Fashion Doll With Outfits").slug("fashion-doll").description("Fashion doll with 5 extra outfits.").price(new BigDecimal("799.00")).stockQuantity(100).seller(admin).imageUrl("https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(educational).name("Wooden Alphabet Blocks").slug("wooden-alphabet-blocks").description("Classic wooden alphabet blocks for toddlers.").price(new BigDecimal("599.00")).stockQuantity(80).seller(admin).imageUrl("https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(educational).name("Math Learning Kit").slug("math-learning-kit").description("Interactive math learning kit for kids.").price(new BigDecimal("1499.00")).stockQuantity(40).seller(admin).imageUrl("https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(boardGames).name("Classic Monopoly").slug("classic-monopoly").description("The classic property trading board game.").price(new BigDecimal("899.00")).stockQuantity(60).seller(admin).imageUrl("https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(boardGames).name("Chess Set").slug("chess-set").description("Premium wooden chess set.").price(new BigDecimal("1199.00")).stockQuantity(25).seller(admin).imageUrl("https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(rcToys).name("RC Off-Road Car").slug("rc-off-road-car").description("High speed remote control off-road car.").price(new BigDecimal("2499.00")).stockQuantity(20).seller(admin).imageUrl("https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=400").build(),
                        Product.builder().category(rcToys).name("Mini Drone").slug("mini-drone").description("Beginner friendly mini drone with camera.").price(new BigDecimal("3499.00")).stockQuantity(10).seller(admin).imageUrl("https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400").build()
                );
                productRepository.saveAll(products);
                System.out.println("✅ Initial Products created successfully.");
            }
        }
    }
}