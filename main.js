class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('buyItems')) || [];
        this.updateUI();
        this.initModal();
    }

    addItem(productName, price) {
        this.items.push({ name: productName, price: price });
        localStorage.setItem('buyItems', JSON.stringify(this.items));
        this.updateUI();
        this.notify(productName);
    }

    addItemAndShow(productName, price) {
        // Prevent duplicate add if same product clicked again immediately? 
        // Actually, user might want to buy multiple, but for "View Specs" purpose, 
        // if it's already there, we just show it.
        const existingIndex = this.items.findIndex(item => item.name === productName);

        if (existingIndex === -1) {
            this.addItem(productName, price);
            this.toggleModal(this.items.length - 1); // Open and expand last item
        } else {
            this.toggleModal(existingIndex); // Open and expand existing item
        }
    }

    removeItem(index) {
        this.items.splice(index, 1);
        localStorage.setItem('buyItems', JSON.stringify(this.items));
        this.updateUI();
        this.renderItems();
    }

    updateUI() {
        const cartNum = document.getElementById('cartNum');
        if (cartNum) {
            cartNum.textContent = this.items.length;
        }
    }

    notify(productName) {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `🛒 ${productName} bought!`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    initModal() {
        // Create modal HTML if it doesn't exist
        if (!document.getElementById('cartModal')) {
            const modalHTML = `
                <div id="cartModal" class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Your Purchases</h2>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div id="cartItemsList" class="modal-body">
                            <!-- Items will be injected here -->
                        </div>
                        <div class="modal-footer">
                            <div class="total-container">
                                <strong>Total:</strong>
                                <span id="cartTotal">₹0</span>
                            </div>
                            <button class="btn btn-primary checkout-btn" onclick="alert('Proceeding to payment...')">Checkout Now</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Add event listeners
            document.querySelector('.close-modal').addEventListener('click', () => this.toggleModal());
            document.getElementById('cartModal').addEventListener('click', (e) => {
                if (e.target.id === 'cartModal') this.toggleModal();
            });

            // Target all Buy buttons (including those in nav)
            const buyBtns = document.querySelectorAll('.cart-btn');
            buyBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleModal();
                });
            });
        }
    }

    toggleModal(expandIndex = null) {
        const modal = document.getElementById('cartModal');
        if (!modal) return;

        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
            this.renderItems(expandIndex);
        }
    }

    renderItems(expandIndex = null) {
        const list = document.getElementById('cartItemsList');
        const totalSpan = document.getElementById('cartTotal');
        if (!list || !totalSpan) return;

        if (this.items.length === 0) {
            list.innerHTML = '<p class="empty-msg">No items bought yet.</p>';
            totalSpan.textContent = '₹0';
            return;
        }

        const productData = {
            // Firefox
            'Firefox Urban Eco': {
                image: 'https://5.imimg.com/data5/SELLER/Default/2024/9/454022211/VD/UL/PH/80979251/whatsapp-image-2024-07-24-at-6-23-47-pm-copy.jpeg',
                rating: 4.5,
                reviews: 128,
                highlights: ['36V 10Ah Lithium-ion', '45 km Range per charge', '250W BLDC Rear Motor', 'Lightweight Alloy Frame'],
                deliveryInfo: 'FREE delivery by Saturday',
                description: 'The Urban Eco is designed for seamless city commutes with eco-friendly efficiency.',
                fullDescription: 'Experience the perfect blend of style and performance with the Firefox Urban Eco. Equipped with a powerful 250W BLDC motor and a reliable 36V Lithium-ion battery, this cycle ensures you reach your destination effortlessly while contributing to a greener planet. Features include a sleek design, responsive brakes, and a comfortable saddle for long rides.',
                specs: { 'Motor Torque': '32 Nm', 'Battery': '36V 10Ah Li-ion', 'Range': '45-90 KM', 'Weight': '18.93 kg' }
            },
            'Firefox Adventron': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmLLZvx3fMcuVb0RIvORwgcSPcphMfb0-VA&s',
                rating: 4.8,
                reviews: 256,
                highlights: ['48V 12Ah Lithium battery', '60 km Range', 'Dual Disc Brakes', 'Front Suspension'],
                deliveryInfo: 'Delivered in 3-5 business days',
                description: 'A rugged powerhouse for adventure enthusiasts seeking high torque and safety.',
                fullDescription: 'Conquer any terrain with the Firefox Adventron. Its high-torque 250W hub motor and dual disc brakes provide unrivaled control and power. Whether you are climbing hills or navigating urban trails, the Adventron offers a stable and exhilarating experience with its premium front suspension and robust build quality.',
                specs: { 'Motor': '250W High Torque Hub', 'Battery': '48V 12Ah Lithium', 'Range': '60-151 KM', 'Brakes': 'Dual Disc' }
            },
            'Firefox Roadster': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmLLZvx3fMcuVb0RIvORwgcSPcphMfb0-VA&s',
                rating: 4.4,
                reviews: 94,
                highlights: ['48V 10Ah Lithium-ion', '50 km Range', 'LED Smart Display', 'Modern Roadster Geometry'],
                deliveryInfo: 'FREE delivery Tomorrow',
                description: 'Sleek roadster design meeting modern tech with a smart LED display.',
                fullDescription: 'The Firefox Roadster is the ideal companion for the modern urbanite. Stay informed with its integrated LED smart display that tracks speed and battery life. Its efficient battery and motor combo make daily travel a breeze, while the refined geometry ensures a comfortable, upright riding position.',
                specs: { 'Motor': '35 Nm Hub Motor', 'Battery': '48V 10Ah Li-ion', 'Range': '50 KM', 'Charging': '5 Hours' }
            },
            'Firefox Gtech': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmLLZvx3fMcuVb0RIvORwgcSPcphMfb0-VA&s',
                rating: 4.6,
                reviews: 112,
                highlights: ['Youth Electric Cycle', '48V 12Ah Lithium', '2 Year Warranty', 'Quick Charge Support'],
                deliveryInfo: 'Next day delivery available',
                description: 'High-torque youth electric cycle with industry-leading 2-year warranty.',
                fullDescription: 'Engineered for the young and the bold, the Firefox Gtech combines safety with excitement. Its high-torque motor provides a responsive feel, while the extensive 2-year warranty offers peace of mind. A perfect entry into the world of electric mobility for youth riders.',
                specs: { 'Motor': '250W High Torque Hub', 'Battery': '48V 12Ah', 'Warranty': '2 Years' }
            },
            'Firefox Cyan': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmLLZvx3fMcuVb0RIvORwgcSPcphMfb0-VA&s',
                rating: 4.3,
                reviews: 78,
                highlights: ['48V 12Ah Lithium', '60 KM Range', 'Dual Disc System', 'Oversized Steel Frame'],
                deliveryInfo: 'FREE delivery Friday',
                description: 'Robust and reliable, featuring an oversized steel alloy frame and long range.',
                fullDescription: 'The Firefox Cyan is built to last. Its oversized steel alloy frame provides exceptional durability without compromising on style. With a 60km range and dual disc brakes, it is a versatile choice for both commuting and leisurely weekend explorations.',
                specs: { 'Battery': '48V 12Ah Lithium', 'Range': '60 KM', 'Frame': 'Oversized Steel Alloy' }
            },
            'Firefox Butane': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmLLZvx3fMcuVb0RIvORwgcSPcphMfb0-VA&s',
                rating: 4.5,
                reviews: 142,
                highlights: ['48V 12Ah Lithium', '60 KM Range', 'Front Zoom Suspension', 'All-Terrain Tires'],
                deliveryInfo: 'FREE delivery by Monday',
                description: 'Explore more with front Zoom suspension and superior lithium power.',
                fullDescription: 'Unleash your potential with the Firefox Butane. The premium front Zoom suspension absorbs bumps for a smooth ride on any surface. Its high-capacity lithium battery ensures you can go the distance, while all-terrain tires provide the grip you need for off-road adventures.',
                specs: { 'Battery': '48V 12Ah Lithium', 'Range': '60 KM', 'Suspension': 'Front Zoom' }
            },

            // Hero Lectro
            'Hero Lectro C3': {
                image: 'https://5.imimg.com/data5/SELLER/Default/2025/1/482596065/HH/QD/TL/28449424/hero-lectro-h7-plus-electric-cycle-1000x1000.jpg',
                rating: 4.2,
                reviews: 86,
                highlights: ['36V 5.8Ah Li-ion', '30 km Range', '25 km/h Top Speed', 'Comfortable City Ride'],
                deliveryInfo: 'FREE delivery by Saturday',
                description: '36V 5.8Ah Li-ion, 30 km Range, 25 km/h Top Speed',
                fullDescription: 'The Hero Lectro C3 is the ultimate entry-level electric cycle for city dwellers. With a range of 30km and a top speed of 25km/h, it is perfect for daily errands and short commutes. Its lightweight frame and efficient motor make it a joy to ride in urban traffic.',
                specs: { 'Motor': '250W BLDC', 'Battery': '36V 5.8Ah', 'Range': '30 KM', 'Torque': '40 Nm' }
            },
            'Hero Lectro F6i': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlbcGOiu27yCsGLytQ9RUyVlJ5AAG_LmruLA&s',
                rating: 4.7,
                reviews: 142,
                highlights: ['36V 11.6Ah Massive Li-ion', '60 km Range', 'Bluetooth App Integrated', 'IP67 Rated Battery'],
                deliveryInfo: 'Delivered in 2-3 business days',
                description: '36V 11.6Ah Massive Li-ion, 60 km Range, Bluetooth App Integrated',
                fullDescription: 'Take your cycling to the next level with the Hero Lectro F6i. Featuring a massive 11.6Ah battery and Bluetooth connectivity, you can track your rides and performance via the integrated app. The IP67 rating ensures your battery is protected against dust and water, making it a reliable choice for all seasons.',
                specs: { 'Motor': '250W Rear Hub', 'Battery': '36V 11.6Ah', 'Range': '60 KM', 'IP Rating': 'IP67' }
            },
            'Hero Lectro F7i': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlbcGOiu27yCsGLytQ9RUyVlJ5AAG_LmruLA&s',
                rating: 4.5,
                reviews: 65,
                highlights: ['36V 6.4Ah BLDC Internal', '35 km Range', '4 Level Pedal Assist', 'Shimano 7-Speed Gears'],
                deliveryInfo: 'FREE delivery Tomorrow',
                description: '36V 6.4Ah BLDC Internal, 35 km Range, 4 Level Pedal Assist',
                fullDescription: 'The Hero Lectro F7i seamlessly blends traditional cycling with modern electric power. Its 4-level pedal assist and 7-speed Shimano gear system allow you to tackle various inclines with ease. The internal battery design keeps the cycle looking sleek and aerodynamic.',
                specs: { 'Motor': '250W BLDC', 'Battery': '36V 6.4Ah', 'Range': '35 KM', 'Frame': 'Alloy 6061' }
            },
            'Hero Lectro F90': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlbcGOiu27yCsGLytQ9RUyVlJ5AAG_LmruLA&s',
                rating: 4.6,
                reviews: 82,
                highlights: ['36V 6.4Ah High Performance', 'Front Telescopic Fork', 'Dual Disc Brakes', 'Rugged Build'],
                deliveryInfo: 'FREE delivery by Monday',
                description: '36V 6.4Ah High Performance, Front Telescopic Fork, Dual Disc',
                fullDescription: 'Built for precision and performance, the Hero Lectro F90 features a front telescopic fork and dual disc brakes for superior handling and safety. Its high-performance battery and rugged build make it a great choice for riders who demand more from their daily commute.',
                specs: { 'Motor': '250W BLDC', 'Battery': '36V 6.4Ah', 'Range': '35 KM', 'Torque': '40 Nm' }
            },
            'Hero Lectro C65': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlbcGOiu27yCsGLytQ9RUyVlJ5AAG_LmruLA&s',
                rating: 4.3,
                reviews: 45,
                highlights: ['36V 6.4Ah BLDC', '35 km Range', '2 Year Warranty', 'Stylish Commuter'],
                deliveryInfo: 'Delivered in 4-6 business days',
                description: '36V 6.4Ah BLDC, 35 km Range, 2 Year Warranty',
                fullDescription: 'The Hero Lectro C65 is a stylish and reliable commuter cycle. With its 35km range and a comprehensive 2-year warranty, it offers both value and peace of mind. Its comfortable design is perfect for navigating busy city streets with confidence.',
                specs: { 'Motor': '250W Rear Hub', 'Battery': '36V 6.4Ah', 'Warranty': '2 Years' }
            },
            'Hero Lectro Conite': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlbcGOiu27yCsGLytQ9RUyVlJ5AAG_LmruLA&s',
                rating: 4.4,
                reviews: 58,
                highlights: ['36V 6.4Ah In-Tube', '35 km Range', 'Heavy Duty Diamond Frame', 'Anti-skid Tires'],
                deliveryInfo: 'FREE delivery Friday',
                description: '36V 6.4Ah In-Tube, 35 km Range, Heavy Duty Diamond Frame',
                fullDescription: 'Experience durability like never before with the Hero Lectro Conite. Its heavy-duty diamond frame and anti-skid tires are built to handle rough roads. The in-tube battery design provides a clean look while maintaining easy access for charging.',
                specs: { 'Motor': '40 Nm Hub', 'Battery': '36V 6.4Ah', 'Tires': '27.5" Anti-skid' }
            },
            'Hero Lectro C5': {
                image: 'https://tse3.mm.bing.net/th/id/OIP.Hh2c5ZIwlIgh6Z0FGcSeKwHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3',
                rating: 4.1,
                reviews: 120,
                highlights: ['36V 5.8Ah Integrated IP67 Battery', '30 km Range', 'Compact Design', 'Efficient Hub Motor'],
                deliveryInfo: 'FREE delivery Tomorrow',
                description: '36V 5.8Ah Integrated IP67 Battery, 30 km Range',
                fullDescription: 'Compact and efficient, the Hero Lectro C5 is perfect for short city hops. The integrated IP67 battery is well-protected and provides a decent range for your daily activities. Its simple yet effective hub motor ensures a smooth and quiet ride.',
                specs: { 'Motor': '40 Nm BLDC', 'Battery': '36V 5.8Ah', 'IP Rating': 'IP67' }
            },
            'Hero Lectro C8': {
                image: 'https://tse3.mm.bing.net/th/id/OIP.lMPkfq_Riqf_U_axaMkdxgHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3',
                rating: 4.5,
                reviews: 110,
                highlights: ['36V 7.8Ah Detachable & Lockable', '60 km Range', 'Smart LED HMI', 'Versatile Performance'],
                deliveryInfo: 'Delivered in 3-5 business days',
                description: '36V 7.8Ah Detachable & Lockable, 60 km Range, Smart LED HMI',
                fullDescription: 'The Hero Lectro C8 offers versatile performance with a focus on convenience. Its detachable and lockable battery makes charging easy and keeps your cycle secure. With a long 60km range and a smart LED HMI, it is ready for any journey.',
                specs: { 'Motor': '40 Nm Rear Hub', 'Battery': '36V 7.8Ah', 'Range': '60 KM' }
            },
            'Hero Lectro C1': {
                image: 'https://th.bing.com/th/id/OIP.A9J8sUZ_HwSc5R1Z4-K3egHaFG?w=249&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
                rating: 4.0,
                reviews: 52,
                highlights: ['36V 5.8Ah Internal Li-ion', '30 km Range', 'High Tensile Steel Frame', 'Reliable Commuter'],
                deliveryInfo: 'FREE delivery Sunday',
                description: '36V 5.8Ah Internal Li-ion, 30 km Range, High Tensile Steel',
                fullDescription: 'Reliable and robust, the Hero Lectro C1 is built with a high tensile steel frame for lasting durability. Perfect for daily commuting, its internal battery and efficient motor provide a steady and dependable ride through city streets.',
                specs: { 'Motor': '40 Nm BLDC', 'Battery': '36V 5.8Ah', 'Frame': 'High Tensile Steel' }
            },
            'Hero Lectro F2i': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFM3xJcDvau2TBVlZRMMSuEcgnpUwxNWdXMA&s',
                rating: 4.6,
                reviews: 135,
                highlights: ['36V 6.4Ah Internal', '7-Speed Shimano Gear System', 'Dual Disk Brakes', 'Off-road Capability'],
                deliveryInfo: 'Next day delivery available',
                description: '36V 6.4Ah Internal, 7-Speed Shimano Gear System, Dual Disk Brakes',
                fullDescription: 'The Hero Lectro F2i is built for those who like to take the path less traveled. With its 7-speed Shimano gear system and dual disc brakes, it offers exceptional performance off-road. Its stylish internal battery design and powerful motor make it a standout on any trail.',
                specs: { 'Motor': '40 Nm', 'Battery': '36V 6.4Ah', 'Gears': '7-Speed Shimano' }
            },

            // EMotorad
            'E-Motorad T-Rex Air': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIRHOOBAnZaiqIO_76k7VnnlF9S3JIBGttZw&s',
                rating: 4.8,
                reviews: 198,
                highlights: ['36V 10.4Ah Detachable Battery', '50+ km Range', 'Dual Suspension', 'Front Zoom Fork'],
                deliveryInfo: 'FREE delivery by Saturday',
                description: '36V 10.4Ah Detachable Battery, 50+ km Range, Dual Suspension',
                fullDescription: 'The EMotorad T-Rex Air is an all-terrain electric cycle designed for power and comfort. With its 36V 10.4Ah detachable battery and dual suspension system, you can explore limitless trails and urban roads. Its front Zoom fork ensures a smooth ride on any surface, while the high-performance motor ensures you reach your destination with ease.',
                specs: { 'Motor': '250W BLDC', 'Battery': '36V 10.2Ah', 'Charge Time': '4-5 Hours' }
            },
            'EMotorad Ytech': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFM3xJcDvau2TBVlZRMMSuEcgnpUwxNWdXMA&s',
                rating: 4.5,
                reviews: 115,
                highlights: ['36V 5.8Ah', '30 KM Range', '250W BLDC', 'Lightweight Performance Alloy'],
                deliveryInfo: 'Delivered in 3-5 business days',
                description: '36V 5.8Ah, 30 KM Range, 250W BLDC, Lightweight Performance Alloy',
                fullDescription: 'Experience lightweight performance with the EMotorad Ytech. Crafted with a lightweight alloy frame and a powerful 250W BLDC motor, it provides a swift and agile ride. Ideal for city commuters, it offers a 30km range on a single charge.',
                specs: { 'Motor': '250W High Torque', 'Battery': '36V 5.8Ah', 'Warranty': '2 Years' }
            },
            'EMotorad Joy': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0g2QT03fyynyV2_-RZCuOCYKlFcVOOcfVfw&s',
                rating: 4.2,
                reviews: 74,
                highlights: ['36V 6.4Ah', '35 KM Range', 'Mechanical Disc Brakes', 'Compact Lifestyle Design'],
                deliveryInfo: 'Next day delivery available',
                description: '36V 6.4Ah, 35 KM Range, Mechanical Disc Brakes',
                fullDescription: 'The EMotorad Joy is all about lifestyle and convenience. Its compact design and mechanical disc brakes make it a safe and stylish option for getting around. With up to 35km of range, it brings joy to every ride, whether for commuting or leisure.',
                specs: { 'Motor': '250W Rear BLDC', 'Battery': '36V 6.4Ah', 'Warranty': '2 Years' }
            },
            'EMotorad Yu7i': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIRHOOBAnZaiqIO_76k7VnnlF9S3JIBGttZw&s',
                rating: 4.6,
                reviews: 89,
                highlights: ['36V 6.4Ah High Performance', '35 KM Range', 'Smart LED HMI', 'Modern Ergonomics'],
                deliveryInfo: 'FREE delivery Friday',
                description: '36V 6.4Ah High Performance, 35 KM Range, Smart LED HMI',
                fullDescription: 'Designed with modern ergonomics and a smart LED HMI, the EMotorad Yu7i offers a superior riding experience. Its high-performance battery provides a range of 35km, and the intuitive interface keeps you in control of your journey.',
                specs: { 'Motor': '250W Hub Motor', 'Battery': '36V 6.4Ah', 'Display': 'Smart LED' }
            },
            'EMotorad Y980': {
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcnk8pOQh5ZpjJ4EsBIJsNF6DJ1SL1L384ew&s',
                rating: 4.4,
                reviews: 63,
                highlights: ['36V 6.4Ah Li-ion', '35 KM Range', 'IP65 Dust & Water Resistant', 'Front Lighting System'],
                deliveryInfo: 'FREE delivery Sunday',
                description: '36V 6.4Ah Li-ion, 35 KM Range, IP65 Dust & Water Resistant',
                fullDescription: 'Be prepared for any weather with the EMotorad Y980. Its IP65 dust and water resistance ensure your cycle is protected from the elements. Featuring a front lighting system for safe night rides, it is a versatile choice for any rider.',
                specs: { 'Motor': '250W Rear Hub', 'Battery': '36V 6.4Ah', 'IP Rating': 'IP65' }
            },
            'EMotorad YBlock': {
                image: 'https://ik.imagekit.io/08ltcz2tbnu/electric-cycles/WhatsApp%20Image%202024-12-23%20at%2019.36.51_6b0cf6b9.avif?updatedAt=1753553583723',
                rating: 4.7,
                reviews: 154,
                highlights: ['36V 6.4Ah Fast Charge', '35 KM Range', 'All-Terrain Performance Tread', 'Heavy Duty Frame'],
                deliveryInfo: 'Delivered in 2-4 business days',
                description: '36V 6.4Ah Fast Charge, 35 KM Range, All-Terrain Performance Tread',
                fullDescription: 'The EMotorad YBlock is built for the adventurous soul. Its massive all-terrain performance treads and fast-charge support mean you spend more time on the road and less time waiting. A heavy-duty frame ensures it can handle your most rugged expeditions.',
                specs: { 'Motor': '250W High Torque', 'Battery': '36V 6.4Ah', 'Tires': 'All-Terrain' }
            },
            'E-Motorad Doodle V3': {
                image: 'https://ik.imagekit.io/08ltcz2tbnu/electric-cycles/WhatsApp%20Image%202024-12-23%20at%2019.36.51_6b0cf6b9.avif?updatedAt=1753553583723',
                rating: 4.9,
                reviews: 210,
                highlights: ['36V 12.75Ah Removable', '60 KM Range', 'Foldable Alloy Frame', 'Fat Tires for Stability'],
                deliveryInfo: 'FREE delivery Wednesday',
                description: '36V 12.75Ah Removable, 60 KM Range, Foldable Alloy Frame',
                fullDescription: 'Conquer the streets with the foldable E-Motorad Doodle V3. Its massive 12.75Ah removable battery and fat tires offer unparalleled stability and range. When not in use, the foldable frame makes it incredibly easy to store and transport.',
                specs: { 'Motor': '250W Rear Hub', 'Battery': '36V 12.75Ah', 'Modes': '5 Level PAS' }
            },
            'E-Motorad Lil E': {
                image: 'https://th.bing.com/th/id/OIP.5OWEp9grFFCsmfISnmabIQHaEK?w=249&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
                rating: 4.0,
                reviews: 42,
                highlights: ['36V 250W Front Hub', 'Up to 20 KM Range', 'Ultra Lightweight Design', 'Kick-Assist E-Bike'],
                deliveryInfo: 'FREE delivery Tomorrow',
                description: '36V 250W Front Hub, Up to 20 KM Range, Ultra Lightweight Design',
                fullDescription: 'The E-Motorad Lil E is the ultimate solution for micro-mobility. This ultra-lightweight kick-assist e-bike is perfect for short dashes and navigating compact environments. It is easy to handle and stores away almost anywhere.',
                specs: { 'Motor': '36V 250W Front Hub', 'Battery': '36V 5.2Ah/7.8Ah' }
            }
        };

        let html = '';
        let total = 0;
        this.items.forEach((item, index) => {
            const priceVal = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
            total += priceVal;
            const data = productData[item.name];

            const shouldExpand = (expandIndex !== null && index === expandIndex);

            html += `
                <div class="cart-item">
                    ${data ? `<img src="${data.image}" class="cart-item-img" alt="${item.name}">` : ''}
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="price-row">
                            <span class="item-price">${item.price}</span>
                            ${data && data.rating ? `
                                <div class="rating-badge">
                                    <span class="stars">${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</span>
                                    <span class="review-count">(${data.reviews})</span>
                                </div>
                            ` : ''}
                        </div>

                        ${data ? `
                            <p class="delivery-tag"><i class="fas fa-truck"></i> ${data.deliveryInfo || 'Standard Delivery'}</p>
                            <p class="cart-item-desc">${data.description}</p>
                            
                            <button class="view-specs-btn" onclick="cart.toggleSpecs(${index})">${shouldExpand ? 'Hide Details' : 'View Details'}</button>
                            
                            <div id="specs-${index}" class="cart-specs" style="display:${shouldExpand ? 'block' : 'none'}">
                                <div class="specs-grid-wrapper">
                                    <div class="specs-column">
                                        <h5>Key Highlights</h5>
                                        <ul class="highlights-list">
                                            ${(data.highlights || []).map(h => `<li>${h}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <div class="specs-column">
                                        <h5>Technical Specs</h5>
                                        <table class="spec-table mini-spec">
                                            ${Object.entries(data.specs).map(([key, val]) => `
                                                <tr>
                                                    <td><b>${key}</b></td>
                                                    <td>${val}</td>
                                                </tr>
                                            `).join('')}
                                        </table>
                                    </div>
                                </div>
                                <div class="full-description">
                                    <h5>Product Overview</h5>
                                    <p>${data.fullDescription || data.description}</p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <button class="remove-btn" onclick="cart.removeItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        list.innerHTML = html;
        totalSpan.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    toggleSpecs(index) {
        const specsDiv = document.getElementById(`specs-${index}`);
        const btn = specsDiv.previousElementSibling;
        if (specsDiv.style.display === 'none') {
            specsDiv.style.display = 'block';
            btn.textContent = 'Hide Details';
        } else {
            specsDiv.style.display = 'none';
            btn.textContent = 'View Details';
        }
    }
}

// Initialize Global Cart
const cart = new Cart();

// Search Functionality
function searchBrand() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    const query = input.value.trim().toLowerCase();
    if (!query) return;

    const brandMap = {
        'firefox': 'firefox.html',
        'hero': 'hero.html',
        'lectro': 'lectro.html',
        'emotorad': 'emotorad.html',
        'e-motorad': 'emotorad.html'
    };

    let target = null;
    for (const [brand, url] of Object.entries(brandMap)) {
        if (query.includes(brand)) {
            target = url;
            break;
        }
    }

    if (target) {
        window.location.href = target;
    } else {
        alert('Sorry, brand not found. Try Firefox, Hero, Lectro or E-Motorad.');
    }
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
