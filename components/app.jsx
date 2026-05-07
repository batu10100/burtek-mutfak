/* Burtek Mutfak — main App */
const { useState: uS, useEffect: uE, useMemo: uM, useRef: uR } = React;

function GlobalNav({ onHome, onCat, cat, query, setQuery, onContact }) {
  return (
    <header className="bk-nav">
      <div className="bk-nav__bar">
        <a className="bk-nav__brand" onClick={onHome}>
          <img src="assets/logo-burtek.png" alt="Burtek" />
        </a>
        <nav className="bk-nav__links">
          <a onClick={() => onCat("all")} className={cat === "all" ? "is-active" : ""}>Katalog</a>
          <a onClick={() => onCat("espresso")} className={cat === "espresso" ? "is-active" : ""}>Espresso</a>
          <a onClick={() => onCat("ovens")} className={cat === "ovens" ? "is-active" : ""}>Fırınlar</a>
          <a onClick={() => onCat("ice")} className={cat === "ice" ? "is-active" : ""}>Buz</a>
          <a onClick={onContact}>İletişim</a>
        </nav>
        <div className="bk-nav__search">
          <i data-lucide="search" />
          <input
            placeholder="Marka veya model ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <a
          className="bk-nav__wa"
          href={waLink("Merhaba, Burtek dijital katalog üzerinden iletişime geçiyorum.")}
          target="_blank"
          rel="noopener"
        >
          <i data-lucide="message-circle" />
          <span>WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

function Hero({ onBrowse, onContact }) {
  return (
    <section className="bk-hero">
      <div className="bk-hero__inner">
        <div className="bk-hero__copy">
          <span className="bk-kicker">Bursa Kahve Festivali · 2026</span>
          <h1 className="bk-hero__h">Stant alanımızda bulunan profesyonel kahve &amp; mutfak ekipmanları.</h1>
          <p className="bk-hero__sub">
            La Cimbali, Nuova Simonelli, Bezzera, Fiorenzato, Mazzer, Unox, Hoshizaki ve çok daha fazlası Burtek Mutfak'ta! Ürünlerimizin tamamı için Bursaspor Stadındaki mağazamıza uğrayın…
          </p>
          <div className="bk-hero__ctas">
            <button className="bk-btn bk-btn--primary" onClick={onBrowse}>
              Kataloğu keşfet
              <i data-lucide="arrow-right" />
            </button>
            <a className="bk-btn bk-btn--ghost" href={waLink("Merhaba, festival standı ve ürünler hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener">
              <i data-lucide="message-circle" />
              WhatsApp ile sor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatBar({ cats, cat, onCat, count }) {
  return (
    <div className="bk-catbar">
      <div className="bk-catbar__inner">
        <div className="bk-catbar__chips">
          {cats.map((c) => (
            <button
              key={c.id}
              className={"bk-chip" + (cat === c.id ? " is-sel" : "")}
              onClick={() => onCat(c.id)}
            >
              {c.label}
              {c.id === "all" && <span className="bk-chip__count">{count}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="bk-card" onClick={() => onOpen(product)}>
      <div className="bk-card__imgwrap">
        <ProductImage src={product.image} alt={product.title} kind={product.placeholder} />
      </div>
      <div className="bk-card__body">
        <div className="bk-card__brand">{product.brand}</div>
        <h3 className="bk-card__title">{product.model}</h3>
        <p className="bk-card__sub">{product.tagline}</p>
        <div className="bk-card__foot">
          <span className="bk-card__cta">Detay <i data-lucide="arrow-up-right" /></span>
          <a
            className="bk-card__wa"
            onClick={(e) => e.stopPropagation()}
            href={waLink(`Merhaba, "${product.brand} ${product.model}" hakkında bilgi ve fiyat almak istiyorum.`)}
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
          >
            <i data-lucide="message-circle" />
          </a>
        </div>
      </div>
    </article>
  );
}

function Catalog({ products, cat, query }) {
  const filtered = uM(() => {
    return products.filter((p) => {
      if (cat !== "all" && p.cat !== cat) return false;
      if (query) {
        const q = query.toLowerCase();
        return (p.brand + " " + p.title + " " + p.model + " " + p.catLabel).toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, cat, query]);

  // Group by category when "all"
  const groups = uM(() => {
    if (cat !== "all") return [{ id: cat, label: filtered[0]?.catLabel || "", items: filtered }];
    const map = new Map();
    filtered.forEach((p) => {
      if (!map.has(p.cat)) map.set(p.cat, { id: p.cat, label: p.catLabel, items: [] });
      map.get(p.cat).items.push(p);
    });
    return Array.from(map.values());
  }, [filtered, cat]);

  if (filtered.length === 0) {
    return (
      <section className="bk-empty">
        <i data-lucide="search-x" />
        <h3>Sonuç bulunamadı</h3>
        <p>Aramanızı genişletin veya kategori değiştirin.</p>
      </section>
    );
  }

  return (
    <section className="bk-catalog" id="catalog">
      {groups.map((g) => (
        <div key={g.id} className="bk-catalog__group">
          <div className="bk-catalog__head">
            <h2 className="bk-catalog__h">{g.label}</h2>
            <span className="bk-catalog__count">{g.items.length} ürün</span>
          </div>
          <div className="bk-grid">
            {g.items.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={(prod) => window.__openProduct(prod)} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function ProductSheet({ product, onClose }) {
  uE(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  uE(() => { lucide.createIcons(); });

  if (!product) return null;
  const waMsg = `Merhaba, "${product.brand} ${product.model}" için fiyat teklifi rica ediyorum.`;

  return (
    <div className="bk-sheet" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bk-sheet__panel" onClick={(e) => e.stopPropagation()}>
        <button className="bk-sheet__close" onClick={onClose} aria-label="Kapat">
          <i data-lucide="x" />
        </button>
        <div className="bk-sheet__grid">
          <div className="bk-sheet__photo">
            <ProductImage src={product.image} alt={product.title} kind={product.placeholder} eager />
          </div>
          <div className="bk-sheet__body">
            <div className="bk-kicker">{product.brand}</div>
            <h2 className="bk-sheet__h">{product.title}</h2>
            <p className="bk-sheet__lead">{product.tagline}</p>
            <p className="bk-sheet__desc">{product.description}</p>
            <div className="bk-sheet__ctas">
              <a className="bk-btn bk-btn--primary" href={waLink(waMsg)} target="_blank" rel="noopener">
                <i data-lucide="message-circle" />
                WhatsApp ile teklif al
              </a>
              <a className="bk-btn bk-btn--ghost" href={`tel:+${WHATSAPP_NUMBER}`}>
                <i data-lucide="phone" />
                Hemen ara
              </a>
            </div>

            <div className="bk-sheet__section">
              <h4 className="bk-sheet__sh">Öne çıkan özellikler</h4>
              <ul className="bk-features">
                {product.features.map((f, i) => (
                  <li key={i}><i data-lucide="check" />{f}</li>
                ))}
              </ul>
            </div>

            <div className="bk-sheet__section">
              <h4 className="bk-sheet__sh">Teknik özellikler</h4>
              <dl className="bk-specs">
                {product.specs.map((s, i) => (
                  <div className="bk-specs__row" key={i}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bk-sheet__assurance">
              <div><i data-lucide="shield-check" /><span><strong>2 yıl garanti</strong><small>Distribütör</small></span></div>
              <div><i data-lucide="wrench" /><span><strong>Türkiye servis</strong><small>Yetkili teknisyen</small></span></div>
              <div><i data-lucide="truck" /><span><strong>1 hafta</strong><small>Stok teslim</small></span></div>
              <div><i data-lucide="graduation-cap" /><span><strong>Barista eğitimi</strong><small>Ücretsiz · Makine eğitimi</small></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <section className="bk-contact" id="contact">
      <div className="bk-contact__inner">
        <div className="bk-contact__copy">
          <span className="bk-kicker bk-kicker--dark">İletişim</span>
          <h2 className="bk-contact__h">Doğrudan WhatsApp.</h2>
          <p className="bk-contact__sub">
            Standımızda görüşelim, ya da hemen yazın. Ürün önerisi, teklif, demo ve servis için tek noktadan hizmet.
          </p>
          <a className="bk-btn bk-btn--cyan bk-btn--lg" href={waLink("Merhaba, Burtek Mutfak ekibinden bilgi almak istiyorum.")} target="_blank" rel="noopener">
            <i data-lucide="message-circle" />
            WhatsApp ile yaz · {WHATSAPP_DISPLAY}
          </a>
          <div className="bk-contact__meta">
            <a href="https://instagram.com/burtekmutfak" target="_blank" rel="noopener"><i data-lucide="instagram" /> burtekmutfak</a>
            <span><i data-lucide="map-pin" /> Burtek Kahve Festivali Stand · A12</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bk-footer">
      <div className="bk-footer__inner">
        <div className="bk-footer__brand">
          <img src="assets/logo-burtek.png" alt="Burtek" />
        </div>
        <div>
          <h5>Kategoriler</h5>
          <a>Espresso makineleri</a>
          <a>Kahve değirmenleri</a>
          <a>Filtre kahve</a>
          <a>Fırınlar</a>
          <a>Buz makineleri</a>
        </div>
        <div>
          <h5>Markalar</h5>
          <a>La Cimbali</a>
          <a>Nuova Simonelli</a>
          <a>Bezzera · Fiorenzato</a>
          <a>UNOX · İnoksan</a>
          <a>Hoshizaki · Robot Coupe</a>
        </div>
        <div>
          <h5>İletişim</h5>
          <a href={waLink("Merhaba")}>WhatsApp · {WHATSAPP_DISPLAY}</a>
          <a href="https://instagram.com/burtekmutfak" target="_blank" rel="noopener">Instagram · burtekmutfak</a>
        </div>
      </div>
      <div className="bk-footer__legal">
        <span>© 2026 Burtek Mutfak · Tüm hakları saklıdır.</span>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  const [tipShown, setTipShown] = uS(true);
  uE(() => {
    const t = setTimeout(() => setTipShown(false), 6000);
    return () => clearTimeout(t);
  }, []);
  return (
    <a
      className="bk-fab"
      href={waLink("Merhaba, Burtek dijital kataloğundan ulaştım.")}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp ile iletişim"
    >
      {tipShown && <span className="bk-fab__tip">Bize yazın · canlı destek</span>}
      <span className="bk-fab__btn">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <path fill="#fff" d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.5L3 29l6.7-1.7c1.9 1 4.1 1.6 6.3 1.6h0c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6h0c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1 1-3.9-.3-.4C5.6 19.9 5 18 5 16 5 9.9 9.9 5 16 5s11 4.9 11 11-4.9 10.6-11 10.6zm6-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.4-.2.2-.4.3-.7.1s-1.4-.5-2.6-1.6c-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.4-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6 0-.1-.3-.2-.5-.3z"/>
        </svg>
      </span>
    </a>
  );
}

function App() {
  const [cat, setCat] = uS("all");
  const [query, setQuery] = uS("");
  const [active, setActive] = uS(null);

  uE(() => { window.__openProduct = setActive; }, []);
  uE(() => { lucide.createIcons(); }, [cat, query, active]);

  const products = window.BURTEK_PRODUCTS;
  const cats = window.BURTEK_CATEGORIES;

  const goCatalog = (c) => {
    setCat(c || "all");
    setTimeout(() => {
      const el = document.getElementById("catalog");
      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
    }, 50);
  };

  const goContact = () => {
    const el = document.getElementById("contact");
    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
  };

  return (
    <>
      <GlobalNav
        onHome={() => { setCat("all"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onCat={goCatalog}
        cat={cat}
        query={query}
        setQuery={setQuery}
        onContact={goContact}
      />
      <Hero onBrowse={() => goCatalog("all")} onContact={goContact} />
      <CatBar cats={cats} cat={cat} onCat={setCat} count={products.length} />
      <Catalog products={products} cat={cat} query={query} />
      <ContactSection />
      <Footer />
      <WhatsAppFab />
      <ProductSheet product={active} onClose={() => setActive(null)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
