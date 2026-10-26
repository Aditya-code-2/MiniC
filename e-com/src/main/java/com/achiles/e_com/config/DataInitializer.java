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

        // Seed Categories
        Category actionFigures = getOrCreateCategory("Action Figures", "action-figures", "Awesome action figures");
        Category dolls = getOrCreateCategory("Dolls & Playsets", "dolls-playsets", "Beautiful dolls and sets");
        Category educational = getOrCreateCategory("Educational Toys", "educational-toys", "Learn while playing");
        Category boardGames = getOrCreateCategory("Board Games", "board-games", "Fun for the whole family");
        Category rcToys = getOrCreateCategory("RC Toys", "rc-toys", "Remote control cars and drones");
        Category deskDecor = getOrCreateCategory("Desk Decor Collectibles", "desk-decor-collectibles", "Collectible mini desk companions and decor");
        Category pocketFidget = getOrCreateCategory("Pocket & Fidget Mini Toys", "pocket-fidget-mini-toys", "Tiny stress-relief, spinner, pop-it, and tactile pocket toys");
        Category kawaiiPlush = getOrCreateCategory("Kawaii Mini Plushies", "kawaii-mini-plushies", "Ultra-soft cute pocket-sized animals and plush keychains");
        Category diecastCars = getOrCreateCategory("Diecast Mini Cars", "diecast-mini-cars", "Premium scale model die-cast miniature metal cars and bikes");
        Category animeChibi = getOrCreateCategory("Anime & Chibi Figurines", "anime-chibi-figurines", "Detailed anime chibi figures, bobbleheads, and desk mini companions");
        Category microBlocks = getOrCreateCategory("Micro Building Blocks", "micro-building-blocks", "Intricate tiny building block sets and architectural miniatures");
        Category mysteryMinis = getOrCreateCategory("Blind Box & Mystery Minis", "blind-box-mystery-minis", "Exciting collectible surprise blind box miniature figures");

        // Seed Standard Products
        createProductIfMissing("Superhero Action Figure", "superhero-action-figure", "Posable superhero figure with accessories.", new BigDecimal("999.00"), 50, "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&q=80&w=400", actionFigures, admin);
        createProductIfMissing("Ninja Warrior Set", "ninja-warrior-set", "Complete ninja warrior action figure set.", new BigDecimal("1299.00"), 30, "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400", actionFigures, admin);
        createProductIfMissing("Princess Doll House", "princess-doll-house", "Large wooden princess doll house.", new BigDecimal("2999.00"), 15, "https://images.unsplash.com/photo-1558066120-e7912613d967?auto=format&fit=crop&q=80&w=400", dolls, admin);
        createProductIfMissing("Fashion Doll With Outfits", "fashion-doll", "Fashion doll with 5 extra outfits.", new BigDecimal("799.00"), 100, "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=400", dolls, admin);
        createProductIfMissing("Wooden Alphabet Blocks", "wooden-alphabet-blocks", "Classic wooden alphabet blocks for toddlers.", new BigDecimal("599.00"), 80, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400", educational, admin);
        createProductIfMissing("Math Learning Kit", "math-learning-kit", "Interactive math learning kit for kids.", new BigDecimal("1499.00"), 40, "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400", educational, admin);
        createProductIfMissing("Classic Monopoly", "classic-monopoly", "The classic property trading board game.", new BigDecimal("899.00"), 60, "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400", boardGames, admin);
        createProductIfMissing("Chess Set", "chess-set", "Premium wooden chess set.", new BigDecimal("1199.00"), 25, "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=400", boardGames, admin);
        createProductIfMissing("RC Off-Road Car", "rc-off-road-car", "High speed remote control off-road car.", new BigDecimal("2499.00"), 20, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=400", rcToys, admin);
        createProductIfMissing("Mini Drone", "mini-drone", "Beginner friendly mini drone with camera.", new BigDecimal("3499.00"), 10, "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400", rcToys, admin);

        // Seed Mini Toys
        createProductIfMissing("Chibi Pikachu Mini Desk Bobblehead", "chibi-pikachu-mini-desk-bobblehead", "Adorable 3-inch mini Pikachu bobblehead with weighted base for car dashboard or work desk.", new BigDecimal("349.00"), 45, "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=600", animeChibi, admin);
        createProductIfMissing("Mini Diecast Vintage Beetle Car (1:64 Scale)", "mini-diecast-vintage-beetle-car", "Detailed classic vintage beetle miniature car with pull-back mechanism and opening doors.", new BigDecimal("499.00"), 60, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=600", diecastCars, admin);
        createProductIfMissing("Kawaii Boba Milk Tea Mini Plush Keychain", "kawaii-boba-milk-tea-mini-plush", "Super squishy 4-inch boba milk tea plush with clip-on keychain for backpacks.", new BigDecimal("299.00"), 80, "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&q=80&w=600", kawaiiPlush, admin);
        createProductIfMissing("Infinity Cube Fidget Mini Toy", "infinity-cube-fidget-mini-toy", "Aluminum alloy mini infinity cube for stress relief, smooth folding and tactile finger play.", new BigDecimal("399.00"), 55, "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=600", pocketFidget, admin);
        createProductIfMissing("Micro Bonsai Tree Nano Block Set", "micro-bonsai-tree-nano-block-set", "750-piece micro building brick set to build a detailed 4-inch miniature bonsai cherry blossom.", new BigDecimal("899.00"), 30, "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=600", microBlocks, admin);
        createProductIfMissing("Pop Mart Space Molly Mystery Blind Box", "pop-mart-space-molly-blind-box", "Single collectible surprise mini figure from the Space Molly futuristic series.", new BigDecimal("749.00"), 25, "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600", mysteryMinis, admin);
        createProductIfMissing("Tiny Ceramic Tea Cup & Teapot Dollhouse Set", "tiny-ceramic-teaset-dollhouse", "1:12 scale porcelain miniature afternoon tea set with floral hand-painted details.", new BigDecimal("449.00"), 40, "https://images.unsplash.com/photo-1558066120-e7912613d967?auto=format&fit=crop&q=80&w=600", dolls, admin);
        createProductIfMissing("Chibi Naruto Sennin Mode Mini Figure", "chibi-naruto-sennin-mini-figure", "High quality PVC 3.5-inch chibi ninja warrior with removable jutsu effect stand.", new BigDecimal("549.00"), 50, "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600", animeChibi, admin);
        createProductIfMissing("Mini Metal Speedster Race Car (Pack of 3)", "mini-metal-speedster-cars-pack-of-3", "Triple set of high-velocity 1:64 scale die-cast racing cars with rubber wheels.", new BigDecimal("699.00"), 35, "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=600", diecastCars, admin);
        createProductIfMissing("Sleepy Axolotl Mini Pocket Plush", "sleepy-axolotl-mini-pocket-plush", "Pocket-sized ultra-soft pastel pink axolotl mini plush with embroidered details.", new BigDecimal("349.00"), 65, "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600", kawaiiPlush, admin);
        createProductIfMissing("Mini Finger Skateboard with Ramp & Tools", "mini-finger-skateboard-set", "Realistic alloy fingerboard with grip tape, spare wheels, and mini screwdriver kit.", new BigDecimal("279.00"), 90, "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=600", pocketFidget, admin);
        createProductIfMissing("Micro Architectural Eiffel Tower Brick Model", "micro-architectural-eiffel-tower", "Over 900 miniature bricks creating a stunning 6-inch architectural replica.", new BigDecimal("999.00"), 20, "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600", microBlocks, admin);
        createProductIfMissing("Retro Arcade Machine Mini Keychain", "retro-arcade-machine-mini-keychain", "Functional mini game keychain with 26 classic 8-bit retro arcade games and sound.", new BigDecimal("499.00"), 45, "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600", educational, admin);
        createProductIfMissing("Gamer Cat Chibi Desk Figurine", "gamer-cat-chibi-desk-figurine", "Cute kitty wearing gaming headset sitting on an RGB desk miniature.", new BigDecimal("399.00"), 50, "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=600", deskDecor, admin);
        createProductIfMissing("Miniature Kitchen Bakery Basket with Croissants", "miniature-kitchen-bakery-basket", "Handcrafted polymer clay miniature wicker basket with 6 realistic tiny bread loaves.", new BigDecimal("329.00"), 35, "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", dolls, admin);
        createProductIfMissing("Chibi Demon Slayer Tanjiro Mini Standee", "chibi-demon-slayer-tanjiro", "3-inch mini acrylic and PVC figure with water-breathing dragon backdrop.", new BigDecimal("499.00"), 40, "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600", animeChibi, admin);
        createProductIfMissing("Diecast Superbike Motorcycle Miniature (1:18)", "diecast-superbike-motorcycle-mini", "Zinc alloy scale replica sports motorcycle with steerable handlebar and spring suspension.", new BigDecimal("799.00"), 28, "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600", diecastCars, admin);
        createProductIfMissing("Fluffy Corgi Butt Mini Squishy Toy", "fluffy-corgi-butt-mini-squishy", "Slow-rising squishy stress toy shaped like a cute sleeping corgi.", new BigDecimal("249.00"), 75, "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600", pocketFidget, admin);
        createProductIfMissing("Mystery Fantasy Creatures Blind Box", "mystery-fantasy-creatures-blind-box", "Collectible surprise mythical creature mini figure with sparkling iridescent finish.", new BigDecimal("699.00"), 30, "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600", mysteryMinis, admin);
        createProductIfMissing("Micro Space Shuttle with Launch Pad", "micro-space-shuttle-launch-pad", "Detailed nano building blocks set replicating a space shuttle on mini crawler transporter.", new BigDecimal("1199.00"), 15, "https://images.unsplash.com/photo-1517976487502-5f65f02f8ddc?auto=format&fit=crop&q=80&w=600", microBlocks, admin);
        createProductIfMissing("Tiny Succulent Garden in Terrarium Bottle", "tiny-succulent-garden-terrarium", "Micro glass vial with handmade clay miniature succulents and crystal gravel.", new BigDecimal("379.00"), 50, "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600", deskDecor, admin);
        createProductIfMissing("Mini Solar Powered Dancing Flower", "mini-solar-powered-dancing-flower", "Eco-friendly solar toy that happily sways and wiggles in sunlight for windowsills and desks.", new BigDecimal("199.00"), 120, "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600", deskDecor, admin);
        createProductIfMissing("Chibi Astronaut Moon Lamp Mini Figure", "chibi-astronaut-moon-lamp", "Mini space explorer holding a glowing LED moon orb with rechargeable battery.", new BigDecimal("649.00"), 35, "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600", deskDecor, admin);
        createProductIfMissing("Vintage Wooden Mini Music Box", "vintage-wooden-mini-music-box", "Hand-cranked pocket music box playing classic melodic tunes with visible brass gears.", new BigDecimal("599.00"), 40, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600", educational, admin);
        createProductIfMissing("Mini Magnetic Gyro Wheel Toy", "mini-magnetic-gyro-wheel-toy", "Light-up magnetic stunt wheel that spins along metal rails using kinetic magnetism.", new BigDecimal("299.00"), 70, "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?auto=format&fit=crop&q=80&w=600", pocketFidget, admin);

        System.out.println("✅ All categories and mini toy products verified and seeded successfully!");
    }

    private Category getOrCreateCategory(String name, String slug, String description) {
        return categoryRepository.findBySlug(slug).orElseGet(() -> {
            if (categoryRepository.existsByName(name)) {
                return categoryRepository.findAll().stream()
                        .filter(c -> c.getName().equalsIgnoreCase(name))
                        .findFirst()
                        .orElseGet(() -> categoryRepository.save(Category.builder().name(name).slug(slug).description(description).build()));
            }
            return categoryRepository.save(Category.builder().name(name).slug(slug).description(description).build());
        });
    }

    private void createProductIfMissing(String name, String slug, String description, BigDecimal price, int stock, String imageUrl, Category category, User seller) {
        if (!productRepository.existsBySlug(slug)) {
            Product product = Product.builder()
                    .name(name)
                    .slug(slug)
                    .description(description)
                    .price(price)
                    .stockQuantity(stock)
                    .imageUrl(imageUrl)
                    .category(category)
                    .seller(seller)
                    .isActive(true)
                    .build();
            productRepository.save(product);
        }
    }
}