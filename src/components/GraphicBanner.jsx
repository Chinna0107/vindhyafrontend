import { motion } from 'framer-motion';
import './GraphicBanner.css';

export default function GraphicBanner() {
  const nodes = [
    {
      key: 'pickles',
      label: 'Pickles',
      img: 'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778404515/WhatsApp_Image_2026-05-10_at_14.44.31_4_eqhu5p.jpg'
    },
    {
      key: 'snacks',
      label: 'Snacks',
      img: 'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778405461/WhatsApp_Image_2026-05-10_at_14.56.05_sncsrn.jpg'
    },
    {
      key: 'podis',
      label: "Podi's",
      img: 'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778405462/WhatsApp_Image_2026-05-10_at_14.56.06_dbvxz4.jpg'
    },
  ];

  const centerImg = 'https://res.cloudinary.com/dgyykbmt6/image/upload/v1778404515/WhatsApp_Image_2026-05-10_at_14.44.31_u6ztzv.jpg';

  return (
    <section className="graphic-banner gb-centered">
      <div className="container gb-grid">
        <div className="gb-left-nodes">
          {nodes.map((n, i) => (
            <motion.div className="gb-node" key={n.key}
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 90 }}>
              <div className="gb-node-img-wrap">
                <img src={n.img} alt={n.label} className="gb-node-img" />
              </div>
              <div className="gb-node-label">{n.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="gb-center-art-wrap">
          <div className="gb-center-art">
            <img src={centerImg} alt="banner" />
          </div>
          <svg className="gb-connectors" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#f6c24c" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e85b3a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <line x1="8" y1="25" x2="52" y2="50" stroke="url(#g1)" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="8" y1="50" x2="52" y2="50" stroke="url(#g1)" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="8" y1="75" x2="52" y2="50" stroke="url(#g1)" strokeWidth="0.6" strokeLinecap="round" />
            <circle cx="52" cy="50" r="2.2" fill="url(#g1)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
