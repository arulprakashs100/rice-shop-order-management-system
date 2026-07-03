package com.riceshop.Riceshop.config;

import com.riceshop.Riceshop.model.Owner;
import com.riceshop.Riceshop.model.Product;
import com.riceshop.Riceshop.repository.OwnerRepository;
import com.riceshop.Riceshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed default owner if none exists
        if (ownerRepository.count() == 0) {
            Owner defaultOwner = Owner.builder()
                    .name("Rahul Sharma")
                    .storeName("Golden Grain Farms")
                    .password("admin")
                    .build();
            ownerRepository.save(defaultOwner);
            System.out.println("Default store owner seeded successfully.");
        }

        // Seed 13 products if catalog table is empty
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                Product.builder()
                    .id("seeraga_samba")
                    .name("Seeraga Samba Rice")
                    .category("Aromatic")
                    .description("Tiny, short-grain aromatic rice grown traditionally. Popularly used in South India for cooking flavorful Biryanis.")
                    .image("../assets/images/seeraga_samba.png")
                    .basePrice(90.0)
                    .rating(4.9)
                    .reviews(320)
                    .stock(450)
                    .origin("Tamil Nadu")
                    .build(),
                Product.builder()
                    .id("nattu_ponni")
                    .name("Nattu Ponni Rice")
                    .category("Traditional")
                    .description("Naturally grown, unpolished medium-grain white rice. Parboiled to retain essential fibers and minerals.")
                    .image("../assets/images/nattu_ponni.png")
                    .basePrice(65.0)
                    .rating(4.8)
                    .reviews(245)
                    .stock(800)
                    .origin("Thanjavur Delta")
                    .build(),
                Product.builder()
                    .id("karnataka_ponni")
                    .name("Karnataka Ponni Rice")
                    .category("Daily Use")
                    .description("A popular choice for daily meals, this medium-grain rice is lightweight, soft, and cooks to a fluffy texture.")
                    .image("../assets/images/nattu_ponni.png")
                    .basePrice(58.0)
                    .rating(4.7)
                    .reviews(180)
                    .stock(750)
                    .origin("Mysore Region")
                    .build(),
                Product.builder()
                    .id("karnataka_rice")
                    .name("Karnataka Rice (Raw)")
                    .category("Daily Use")
                    .description("Premium quality raw white rice. Highly versatile and ideal for daily South Indian lunch plates.")
                    .image("../assets/images/nattu_ponni.png")
                    .basePrice(52.0)
                    .rating(4.6)
                    .reviews(135)
                    .stock(600)
                    .origin("Shimoga District")
                    .build(),
                Product.builder()
                    .id("idli_rice")
                    .name("Idli Rice")
                    .category("Daily Use")
                    .description("Short, thick parboiled white rice. Essential ingredient for making smooth batter for soft idlis and crispy dosas.")
                    .image("../assets/images/idli_rice.png")
                    .basePrice(48.0)
                    .rating(4.8)
                    .reviews(290)
                    .stock(900)
                    .origin("Salem Plains")
                    .build(),
                Product.builder()
                    .id("raw_rice")
                    .name("Raw Rice (Pachai Arisi)")
                    .category("Traditional")
                    .description("Polished raw white rice grains. Used for making traditional festive dishes like Sweet Pongal and rice flour.")
                    .image("../assets/images/nattu_ponni.png")
                    .basePrice(50.0)
                    .rating(4.5)
                    .reviews(110)
                    .stock(500)
                    .origin("Nellore Fields")
                    .build(),
                Product.builder()
                    .id("small_grain")
                    .name("Small Grain Rice")
                    .category("Daily Use")
                    .description("Short, slender grains that cook quickly. A soft texture makes it perfect for kids and curd rice preparation.")
                    .image("../assets/images/nattu_ponni.png")
                    .basePrice(55.0)
                    .rating(4.6)
                    .reviews(95)
                    .stock(400)
                    .origin("Palakkad region")
                    .build(),
                Product.builder()
                    .id("varagu")
                    .name("Varagu Rice (Kodo Millet)")
                    .category("Millets")
                    .description("Gluten-free, highly nutritious whole grain millet. High in dietary fiber, iron, and antioxidants; ideal for sugar control.")
                    .image("../assets/images/varagu.png")
                    .basePrice(85.0)
                    .rating(4.7)
                    .reviews(154)
                    .stock(300)
                    .origin("Dharwad region")
                    .build(),
                Product.builder()
                    .id("samai")
                    .name("Samai Rice (Little Millet)")
                    .category("Millets")
                    .description("Tiny, mineral-rich organic millet. Packed with B-vitamins and calcium. A healthy rice replacement for traditional recipes.")
                    .image("../assets/images/varagu.png")
                    .basePrice(95.0)
                    .rating(4.7)
                    .reviews(120)
                    .stock(250)
                    .origin("Madurai Hills")
                    .build(),
                Product.builder()
                    .id("kuthiraivali")
                    .name("Kuthiraivali Rice (Barnyard Millet)")
                    .category("Millets")
                    .description("Barnyard millet is an ancient grain rich in digestible protein and fiber. Low glycemic index; great for weight loss.")
                    .image("../assets/images/idli_rice.png")
                    .basePrice(90.0)
                    .rating(4.8)
                    .reviews(142)
                    .stock(350)
                    .origin("Coimbatore region")
                    .build(),
                Product.builder()
                    .id("kambu")
                    .name("Kambu Rice (Pearl Millet)")
                    .category("Millets")
                    .description("Organic Pearl Millet grains. Rich in iron, magnesium, and proteins. Traditionally prepared as 'Kambu Koozh' in summer.")
                    .image("../assets/images/kambu.png")
                    .basePrice(70.0)
                    .rating(4.8)
                    .reviews(198)
                    .stock(400)
                    .origin("Tirunelveli Region")
                    .build(),
                Product.builder()
                    .id("chinna_seeragam")
                    .name("Chinna Seeragam Rice")
                    .category("Aromatic")
                    .description("Very tiny, premium aromatic rice variety. Extremely soft texture and rich aroma; prized for traditional South Indian feasts.")
                    .image("../assets/images/seeraga_samba.png")
                    .basePrice(88.0)
                    .rating(4.9)
                    .reviews(165)
                    .stock(280)
                    .origin("Vellore Valley")
                    .build(),
                Product.builder()
                    .id("chinna_kili")
                    .name("Chinna Kili Rice")
                    .category("Traditional")
                    .description("A rare and traditional South Indian rice variety, parboiled and full of red bran nutrients. Distinct rustic flavor.")
                    .image("../assets/images/nattu_ponni.png")
                    .basePrice(62.0)
                    .rating(4.7)
                    .reviews(82)
                    .stock(200)
                    .origin("Trichy region")
                    .build()
            );
            productRepository.saveAll(products);
            System.out.println("Product catalog of 13 South Indian varieties seeded successfully.");
        }
    }
}
