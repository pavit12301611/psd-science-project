import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

const dyes = [
  { id: 'blackberry', label: 'Blackberry', short: 'BB', color: '#e6867d' },
  { id: 'blueberry', label: 'Blueberry', short: 'BL', color: '#8fb7ce' },
  { id: 'jamun', label: 'Jamun', short: 'JM', color: '#c991ad' },
] as const;

type DyeId = (typeof dyes)[number]['id'];

type CellLayerId = 'glass' | 'tio2' | 'dye' | 'electrolyte' | 'counter';

const cellLayers = [
  {
    id: 'glass', n: '01', name: 'Conductive glass (FTO / ITO)', label: 'Transparent current collector',
    text: 'Light passes through the glass. A very thin conductive coating on it carries electrons from the TiO₂ photoanode into the external wire.',
    check: 'Identify the coated face using the kit directions and a multimeter. Do not scratch or rub the coating.',
    analogy: 'A clear road that lets light in and gives electrons a route out.',
  },
  {
    id: 'tio2', n: '02', name: 'Porous titanium dioxide (TiO₂)', label: 'Semiconductor scaffold',
    text: 'The nanoporous surface gives many dye molecules a place to attach. After injection, electrons move through this TiO₂ network to the conductive glass.',
    check: 'Use a pre-coated electrode for a first build. A random powder layer is not the same as a porous, well-connected film.',
    analogy: 'A very fine scaffold that holds lots of light-catching dye.',
  },
  {
    id: 'dye', n: '03', name: 'Berry pigment', label: 'Light sensitizer',
    text: 'Pigment molecules absorb photons and become excited. An excited dye can inject an electron into TiO₂; the berry is not the energy source by itself.',
    check: 'Filter the extract and keep the soak time the same for every sample. Record which fruit produced each dye.',
    analogy: 'An antenna that catches light and hands off an electron.',
  },
  {
    id: 'electrolyte', n: '04', name: 'Electrolyte', label: 'Iodide / triiodide redox mediator',
    text: 'The redox couple helps return an electron to the oxidized dye. At the counter electrode, triiodide is reduced and the charge cycle can continue.',
    check: 'Use only the kit solution and follow its safety sheet. A teacher supervises handling; avoid skin and eye contact.',
    analogy: 'A chemical shuttle that helps reset the dye for another cycle.',
  },
  {
    id: 'counter', n: '05', name: 'Counter electrode', label: 'Carbon / catalytic surface',
    text: 'Electrons arriving through the external circuit reach this electrode. Its surface supports the electrolyte reaction that closes the loop.',
    check: 'Keep contact points accessible and assemble the two plates exactly as the kit specifies.',
    analogy: 'The return station where the external electron meets the cell chemistry again.',
  },
] as const;

const links = {
  nisenet: 'https://www.nisenet.org/sites/default/files/catalog/uploads/5553/solarcell_facilitator__guide.pdf',
  vanderbilt: 'https://www.vanderbilt.edu/youngscientistjournal/article/dye-sensitized-solar-cells-optimization-of-parameters-to-maximize-efficiency/',
  arduino: 'https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/',
  kit: 'https://stemlearningkit.com/product/dye-sensitized-solar-kit-enthusiast/',
  uno: 'https://robu.in/product/arduino-uno-r3-ch340g-atmega328p-cable-arduino-uno-transparent-acrylic-case-arduino-uno-r3/?gQT=2',
  ldr: 'https://robu.in/product/lm393-photosensitive-light-dependent-control-sensor-module/',
  buffer: 'https://www.dnatechindia.com/mcp6002-amplifieer-dip-ic-buy-in-india.html',
  breadboard: 'https://robu.in/product/mb102-830-points-solderless-prototype-breadboard-power-supply-module-140-jumper-wires-arduino-diy-starter-kit/',
  meter: 'https://www.electronicscomp.com/mastech-ms833-original-digital-multimeter',
  resistors: 'https://robu.in/product/pro-range-resistor-assortment-kit/',
  oled: 'https://robu.in/product/0-96-inch-i2c-iic-oled-lcd-module-4pin-with-vcc-gnd-blue/',
} as const;

const money = (amount: number) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;

function BrandMark() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true" className="brand-mark">
      <circle cx="21" cy="22" r="15" fill="#a8434e" />
      <path d="M20 8c4-6 10-5 13-4-1 5-5 8-11 8" fill="#72836b" />
      <path d="M14 18c1.5-1 2.5 1 1.5 2.1s-2.7.5-1.5-2.1Zm9-3c1.7-1 2.9 1 1.5 2.4-1.2 1-2.7.2-1.5-2.4Zm4 10c1.6-1.1 2.8 1 1.4 2.4-1.2 1-2.7.1-1.4-2.4Zm-11 4c1.3-1.1 2.6.5 1.8 1.8-1 .9-2.5.3-1.8-1.8Z" fill="#f4d8a1" />
      <path d="M21 7v-4M8 10 5 7M34 12l4-2" stroke="#344b3d" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="topline">
        <div className="shell topline-inner">
          <span>FIELD NOTE <b>№ 01</b> · STUDENT ENERGY LAB</span>
          <span className="topline-right"><i aria-hidden="true" /> CHEMISTRY × RENEWABLE ENERGY × CODE</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" onClick={closeMenu} aria-label="Berry to current, home">
            <BrandMark />
            <span><b>berry</b><small>to current</small></span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /> <span /> <span />
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
          <nav id="main-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            <a href="#cell" onClick={closeMenu}>Cell anatomy</a>
            <a href="#dashboard" onClick={closeMenu}>Dashboard</a>
            <a href="#investigation" onClick={closeMenu}>Test plan</a>
            <a href="#budget" onClick={closeMenu}>Budget</a>
            <a href="#sources" onClick={closeMenu}>Sources</a>
          </nav>
          <a className="header-cta" href="#budget">Build estimate <span aria-hidden="true">↗</span></a>
        </div>
      </header>
    </>
  );
}

function HeroPhoto() {
  return (
    <figure className="hero-figure hero-photo">
      <div className="figure-label-row">
        <span><b>FIG. 01</b> / BENCH PROTOTYPE</span>
        <span>ILLUSTRATIVE BUILD</span>
      </div>
      <div className="hero-photo-frame">
        <img
          className="hero-photo-image"
          src="/images/berry-dssc-hero.jpg"
          alt="Illustrative close-up of a small berry-stained DSSC cell held by binder clips, with test leads, filtered berry extract and a multimeter on a lab bench."
          loading="eager"
        />
        <span className="photo-chip photo-chip-top">DSSC / SMALL-SCALE CELL</span>
        <span className="photo-chip photo-chip-bottom">BERRY DYE ≠ POWER SOURCE</span>
      </div>
      <figcaption><span>01</span>Generated visual of the proposed bench build. Replace it with your own cell photograph for the final exhibition.</figcaption>
    </figure>
  );
}

function SectionHeading({ index, eyebrow, title, copy, light = false }: { index: string; eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return (
    <div className={`section-heading${light ? ' section-heading-light' : ''}`}>
      <div className="section-number">{index}<span> / 07</span></div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {copy && <p className="section-copy">{copy}</p>}
      </div>
    </div>
  );
}

function ExplodedCellIllustration({ activeLayer }: { activeLayer: CellLayerId }) {
  return (
    <div className="exploded-figure-wrap">
      <div className="exploded-caption"><span>FIG. 02 / EXPLODED VIEW</span><span>FIVE WORKING PARTS</span></div>
      <svg className={`exploded-svg active-${activeLayer}`} viewBox="0 0 560 420" role="img" aria-labelledby="exploded-title exploded-desc">
        <title id="exploded-title">Exploded layers of a dye-sensitized solar cell</title>
        <desc id="exploded-desc">A separated view of conductive glass, porous titanium dioxide with dye, electrolyte, counter electrode and a second conductive glass plate.</desc>
        <defs>
          <pattern id="particle-pattern" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="5" r="2.2" fill="#718672" />
            <circle cx="13" cy="13" r="2" fill="#8ca187" />
          </pattern>
        </defs>
        <rect width="560" height="420" fill="#f8f6ef" />
        <path d="M35 31H525" stroke="#d7d3c7" />
        <text x="36" y="23" className="svg-mono">CELL ANATOMY / LAYERS SEPARATED FOR CLARITY</text>
        <path d="M283 61v300" stroke="#98a296" strokeDasharray="3 7" strokeWidth="1.5" />
        <path d="M274 82h18M274 133h18M274 197h18M274 258h18M274 315h18M274 364h18" stroke="#98a296" strokeWidth="1.2" />

        <g className={`diagram-part glass-part${activeLayer === 'glass' ? ' is-active' : ''}`}>
          <rect x="110" y="54" width="345" height="27" fill="#c9dcd7" stroke="#456c66" strokeWidth="1.5" />
          <rect x="110" y="84" width="345" height="8" fill="#83aaa1" stroke="#456c66" strokeWidth="1.2" />
          <path d="M78 67h26M457 67h27" stroke="#6f7a70" />
          <circle cx="60" cy="67" r="12" fill="#163d35" /><text x="60" y="71" textAnchor="middle" className="svg-number">01</text>
          <text x="490" y="63" className="svg-mono">FTO GLASS</text><text x="490" y="78" className="svg-small">transparent collector</text>
        </g>
        <g className={`diagram-part tio2-part${activeLayer === 'tio2' ? ' is-active' : ''}`}>
          <rect x="110" y="111" width="345" height="42" fill="#e4eadc" stroke="#788b74" strokeWidth="1.3" />
          <rect x="110" y="111" width="345" height="42" fill="url(#particle-pattern)" />
          <g className={`dye-part${activeLayer === 'dye' ? ' is-active' : ''}`}>
            <circle cx="170" cy="119" r="4" fill="#ad424e" /><circle cx="228" cy="139" r="4" fill="#ad424e" />
            <circle cx="302" cy="122" r="4" fill="#ad424e" /><circle cx="372" cy="142" r="4" fill="#ad424e" />
            <circle cx="420" cy="120" r="4" fill="#ad424e" />
          </g>
          <path d="M78 132h26M457 132h27" stroke="#6f7a70" />
          <circle cx="60" cy="132" r="12" fill="#163d35" /><text x="60" y="136" textAnchor="middle" className="svg-number">02</text>
          <text x="490" y="128" className="svg-mono">TiO₂ + DYE</text><text x="490" y="143" className="svg-small">porous semiconductor</text>
        </g>
        <g className={`diagram-part electrolyte-part${activeLayer === 'electrolyte' ? ' is-active' : ''}`}>
          <rect x="110" y="178" width="345" height="29" fill="#f0e3c2" stroke="#aa9565" strokeWidth="1.3" />
          <circle cx="190" cy="192" r="3" fill="#b69a55" /><circle cx="270" cy="193" r="3" fill="#b69a55" />
          <circle cx="353" cy="190" r="3" fill="#b69a55" /><circle cx="412" cy="195" r="3" fill="#b69a55" />
          <path d="M78 192h26M457 192h27" stroke="#6f7a70" />
          <circle cx="60" cy="192" r="12" fill="#163d35" /><text x="60" y="196" textAnchor="middle" className="svg-number">03</text>
          <text x="490" y="189" className="svg-mono">ELECTROLYTE</text><text x="490" y="204" className="svg-small">redox mediator</text>
        </g>
        <g className={`diagram-part counter-part${activeLayer === 'counter' ? ' is-active' : ''}`}>
          <rect x="110" y="233" width="345" height="13" fill="#414f49" />
          <path d="M78 239h26M457 239h27" stroke="#6f7a70" />
          <circle cx="60" cy="239" r="12" fill="#163d35" /><text x="60" y="243" textAnchor="middle" className="svg-number">04</text>
          <text x="490" y="236" className="svg-mono">COUNTER ELECTRODE</text><text x="490" y="251" className="svg-small">carbon / catalyst surface</text>
        </g>
        <g className={`diagram-part glass-part${activeLayer === 'glass' ? ' is-active' : ''}`}>
          <rect x="110" y="274" width="345" height="25" fill="#c9dcd7" stroke="#456c66" strokeWidth="1.5" />
          <rect x="110" y="301" width="345" height="8" fill="#83aaa1" stroke="#456c66" strokeWidth="1.2" />
          <path d="M78 287h26M457 287h27" stroke="#6f7a70" />
          <circle cx="60" cy="287" r="12" fill="#163d35" /><text x="60" y="291" textAnchor="middle" className="svg-number">05</text>
          <text x="490" y="283" className="svg-mono">CONDUCTIVE GLASS</text><text x="490" y="298" className="svg-small">counter contact</text>
        </g>
        <path d="M175 332v23m0 0-7-8m7 8 7-8" stroke="#a8434e" strokeWidth="2" fill="none" />
        <text x="190" y="351" className="svg-mono svg-berry">ASSEMBLE AS A SEALED SANDWICH</text>
        <text x="36" y="393" className="svg-small">Use the kit’s coating, spacing and electrolyte directions; real layer thicknesses are not to scale.</text>
      </svg>
    </div>
  );
}

function ComponentsPhoto() {
  return (
    <figure className="components-photo-card">
      <div className="components-photo-frame">
        <img
          src="/images/dssc-components.jpg"
          alt="Illustrative overhead layout of conductive glass, berry dye materials, small electronics, breadboard, meter and safety equipment for a DSSC school build."
          loading="lazy"
        />
        <span className="photo-chip photo-chip-top">FIG. 02 / MATERIALS ON THE BENCH</span>
      </div>
      <figcaption className="components-photo-caption">
        <div>
          <span className="panel-kicker">A BUILD IS A SET OF PARTS</span>
          <h3>Cell chemistry on one side. Measurement tools on the other.</h3>
          <p>This generated layout is a visual checklist, not a promise that every kit includes every item. Compare each real kit with the linked bill of materials before buying.</p>
        </div>
        <ul>
          <li><i className="component-dot dot-berry" /> Conductive glass + TiO₂</li>
          <li><i className="component-dot dot-sun" /> Berry extract + electrolyte</li>
          <li><i className="component-dot dot-leaf" /> UNO, LDR + buffer circuit</li>
          <li><i className="component-dot dot-ink" /> Meter, leads + safety gear</li>
        </ul>
      </figcaption>
    </figure>
  );
}

function CellAnatomy() {
  const [activeLayer, setActiveLayer] = useState<CellLayerId>('glass');
  const selected = cellLayers.find((layer) => layer.id === activeLayer) ?? cellLayers[0];

  return (
    <section className="section anatomy-section" id="cell">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="A cell, not a juice trick"
          title="Five layers. One electron loop."
          copy="Tap a layer to highlight it in the cutaway and see its job, a practical check, and a simple mental model. The berry supplies pigment; the complete DSSC converts light into a small electrical signal."
        />
        <div className="anatomy-grid">
          <ExplodedCellIllustration activeLayer={activeLayer} />
          <div className="layer-list" role="group" aria-label="Select a dye-sensitized solar cell layer to explore">
            <div className="layer-list-head"><span>SELECT A PART</span><span>5 LAYERS</span></div>
            {cellLayers.map((layer) => (
              <button
                className={`layer-row${activeLayer === layer.id ? ' is-selected' : ''}`}
                type="button"
                key={layer.id}
                aria-pressed={activeLayer === layer.id}
                onClick={() => setActiveLayer(layer.id)}
              >
                <span className="layer-number">{layer.n}</span>
                <span className="layer-row-copy">
                  <b>{layer.name}</b>
                  <span className="layer-label">{layer.label}</span>
                </span>
                <span className="layer-dot" aria-hidden="true" />
              </button>
            ))}
            <aside className="layer-explainer" aria-live="polite">
              <div className="layer-explainer-head"><span>PART {selected.n} / WHAT IT DOES</span><span>SELECTED</span></div>
              <h3>{selected.name}</h3>
              <p>{selected.text}</p>
              <div className="layer-inspect"><b>CHECK / CARE</b><span>{selected.check}</span></div>
              <div className="layer-analogy"><b>MENTAL MODEL</b><span>{selected.analogy}</span></div>
            </aside>
          </div>
        </div>
        <ComponentsPhoto />
        <aside className="kit-advice">
          <div className="advice-stamp">FIRST BUILD<br />TIP</div>
          <p><strong>Choose a kit with pre-coated TiO₂ and conductive glass.</strong> Ordinary window glass and random white TiO₂ powder do not make a reliable photoanode; electrode preparation and the kit’s electrolyte matter. <a className="claim-source" href="#source-science">[S1]</a></p>
          <a className="text-link" href="#budget">See the kit allowance <span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </section>
  );
}

function Mechanism() {
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = [
    {
      num: '01', title: 'Catch a photon', text: 'The berry dye absorbs light.', detail: 'A photon gives energy to a dye molecule adsorbed on the TiO₂ surface. The molecule moves from its ground state to an excited state; the incoming light, not the fruit, supplies the energy.', equation: 'S + hν → S*', route: 'photon → dye', hinglish: 'Sunlight ki photon energy dye ko excite karti hai.', judgeLine: '“The berry pigment is the light sensitizer, not a battery.”', icon: 'sun',
    },
    {
      num: '02', title: 'Inject an electron', text: 'Excited dye hands off charge.', detail: 'The excited dye transfers an electron into the conduction band of porous TiO₂. The dye is now oxidized and needs to be regenerated by the electrolyte.', equation: 'S* → S⁺ + e⁻(TiO₂)', route: 'dye → TiO₂', hinglish: 'Excited dye apna electron TiO₂ ko transfer karta hai.', judgeLine: '“TiO₂ transports the electron; the berry dye helps absorb visible light.”', icon: 'spark',
    },
    {
      num: '03', title: 'Do circuit work', text: 'Electron travels through the wire.', detail: 'Electrons move through the TiO₂ network to the conductive glass, then through an external path and load to the counter electrode. This external flow is the current you can measure.', equation: 'photoanode → load → counter electrode', route: 'FTO → load', hinglish: 'Electron external wire aur load se guzarta hai—yahin current measure hota hai.', judgeLine: '“The measurable current comes from the complete cell connected to a circuit.”', icon: 'circuit',
    },
    {
      num: '04', title: 'Restore the dye', text: 'Electrolyte closes the cycle.', detail: 'The iodide/triiodide redox mediator helps return an electron to the oxidized dye. At the counter electrode, triiodide is reduced. The cycle can repeat while light is available.', equation: 'S⁺ → S  ·  I₃⁻ + 2e⁻ → 3I⁻', route: 'redox → reset', hinglish: 'Electrolyte oxidized dye ko reset karne mein help karta hai.', judgeLine: '“The electrolyte regenerates the dye; it is an essential part of the cell.”', icon: 'cycle',
    },
  ] as const;
  const active = steps[activeIndex];
  const goTo = (direction: -1 | 1) => setActiveIndex((index) => (index + direction + steps.length) % steps.length);

  return (
    <section className="section mechanism-section" id="chemistry">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="The chemistry, one step at a time"
          title="Follow the charge, not just the colour."
          copy="Choose a stage. The explanation, electron route, simplified chemistry and judge-ready sentence update together."
        />
        <div className="mechanism-track" role="group" aria-label="Select a stage in the DSSC electron cycle">
          {steps.map((step, index) => (
            <button
              className={`mechanism-step${activeIndex === index ? ' is-active' : ''}`}
              type="button"
              key={step.num}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              <span className={`mechanism-icon icon-${step.icon}`} aria-hidden="true">
                {step.icon === 'sun' && <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="11" /><path d="M32 5v11M32 48v11M5 32h11M48 32h11M13 13l8 8M43 43l8 8M51 13l-8 8M21 43l-8 8" /></svg>}
                {step.icon === 'spark' && <svg viewBox="0 0 64 64"><path d="m35 5-17 28h13l-2 26 19-34H35l6-20Z" /><circle cx="13" cy="17" r="2" /><circle cx="52" cy="47" r="2" /></svg>}
                {step.icon === 'circuit' && <svg viewBox="0 0 64 64"><path d="M9 17h12v30H9M55 17H43v30h12M21 32h7m8 0h7" /><path d="m28 22 8 10-8 10" /><circle cx="9" cy="17" r="3" /><circle cx="55" cy="47" r="3" /></svg>}
                {step.icon === 'cycle' && <svg viewBox="0 0 64 64"><path d="M49 22a19 19 0 0 0-32-7l-5 5M15 42a19 19 0 0 0 32 7l5-5" /><path d="M12 10v10h10M52 54V44H42" /><text x="32" y="37" textAnchor="middle">I⁻</text></svg>}
              </span>
              <span className="mechanism-topline"><span>{step.num}</span><i /></span>
              <b className="mechanism-step-title">{step.title}</b>
              <span className="mechanism-step-summary">{step.text}</span>
              <span className="step-open-hint">{activeIndex === index ? 'CURRENT STEP' : 'TAP TO EXPLORE'} <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
        <div className="electron-route" role="group" aria-label={`Select a stage in the electron route; current stage: ${active.route}`}>
          {steps.map((step, index) => (
            <button
              className={`route-node${activeIndex === index ? ' is-current' : ''}${activeIndex > index ? ' is-passed' : ''}`}
              type="button"
              key={`route-${step.num}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              <span>{step.num}</span><b>{step.route}</b>
            </button>
          ))}
        </div>
        <div className="mechanism-explainer" aria-live="polite">
          <div className="mechanism-explainer-index"><span>STEP</span><b>{active.num}</b><small>OF 04</small></div>
          <div className="mechanism-explainer-copy">
            <span className="panel-kicker">WHAT HAPPENS INSIDE</span>
            <h3>{active.title}</h3>
            <p>{active.detail}</p>
            <p className="hinglish-line"><b>Hinglish:</b> {active.hinglish}</p>
          </div>
          <div className="judge-line-box">
            <span>JUDGE-READY LINE</span>
            <p>{active.judgeLine}</p>
            <code>{active.equation}</code>
          </div>
        </div>
        <div className="mechanism-controls">
          <button type="button" onClick={() => goTo(-1)}>← Previous stage</button>
          <span>INTERACTIVE CYCLE / {activeIndex + 1} OF {steps.length}</span>
          <button type="button" onClick={() => goTo(1)}>Next stage →</button>
        </div>
        <div className="reaction-strip">
          <span className="reaction-label">THE WHOLE LOOP</span>
          <p><b>light</b> → dye* → e⁻ into TiO₂ → external load → redox electrolyte → <b>dye restored</b></p>
          <a href="#source-method">Read the source notes <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

function SignalDiagram() {
  return (
    <div className="signal-card">
      <div className="signal-card-head">
        <span>FIG. 03 / DATA PATH</span>
        <span className="signal-card-mark">A0 · A1</span>
      </div>
      <div className="signal-lanes">
        <div className="signal-lane voltage-lane">
          <div className="signal-source"><span className="node-icon">D</span><div><b>DSSC cell</b><small>weak voltage source</small></div></div>
          <span className="flow-arrow" aria-hidden="true">→</span>
          <div className="signal-buffer"><span className="node-mini">Hi-Z</span><div><b>Buffer</b><small>high-input impedance</small></div></div>
          <span className="flow-arrow" aria-hidden="true">→</span>
          <span className="pin-box">A1</span>
        </div>
        <div className="signal-lane light-lane">
          <div className="signal-source"><span className="node-icon ldr-icon">L</span><div><b>LDR module</b><small>relative light level</small></div></div>
          <span className="flow-arrow" aria-hidden="true">→</span>
          <div className="sensor-note">analog output</div>
          <span className="flow-arrow" aria-hidden="true">→</span>
          <span className="pin-box">A0</span>
        </div>
        <div className="signal-join"><span>ANALOG READINGS</span><i /></div>
        <div className="signal-lane output-lane">
          <div className="board-chip"><span className="board-led" /><b>UNO R3</b><small>powered over USB</small></div>
          <span className="flow-arrow" aria-hidden="true">⇢</span>
          <div className="usb-note">USB serial</div>
          <span className="flow-arrow" aria-hidden="true">⇢</span>
          <div className="laptop-chip"><span className="mini-chart"><i /><i /><i /><i /><i /></span><b>Laptop</b><small>live graph</small></div>
        </div>
      </div>
      <div className="signal-foot">
        <span className="signal-caution">MEASURE FIRST</span>
        <p>Verify the cell with a multimeter. Use a high-input-impedance buffer before A1 and power the board over USB. Arduino analogRead returns raw ADC counts—not lux—unless you calibrate the sensor. <a className="claim-source" href="#source-arduino">[S3]</a></p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [light, setLight] = useState(68);
  const [covered, setCovered] = useState(false);
  const [selectedDye, setSelectedDye] = useState<DyeId>('blackberry');
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setTick((value) => value + 1), 850);
    return () => window.clearInterval(timer);
  }, [running]);

  const effectiveLight = covered ? 4 : light;
  const demoValues = useMemo(() => {
    const base = effectiveLight === 0 ? 0 : effectiveLight * 4.15;
    return Array.from({ length: 17 }, (_, index) => {
      const wave = Math.sin((index + tick * 0.55) * 0.9) * 7 + Math.cos((index + tick) * 0.31) * 4;
      return Math.max(0, Math.min(450, Math.round(base + (effectiveLight === 0 ? 0 : wave))));
    });
  }, [effectiveLight, tick]);

  const currentValue = demoValues[demoValues.length - 1] ?? 0;
  const sensorCount = Math.round(effectiveLight * 10.23);
  const dye = dyes.find((item) => item.id === selectedDye) ?? dyes[0];
  const graphPoints = demoValues.map((value, index) => {
    const x = 50 + index * 34.1;
    const y = 193 - (value / 450) * 150;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const graphPointList = graphPoints.split(' ');
  const lastPoint = graphPointList[graphPointList.length - 1]?.split(',') ?? ['596', '193'];

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Sensors meet electrochemistry"
          title="A dashboard that says what it knows."
          copy="Explore the interface with a labelled browser simulation. It is not connected to hardware and is not a voltage prediction; your Arduino readings belong in your own graph."
          light
        />
        <div className="dashboard-layout">
          <SignalDiagram />
          <div className="live-panel">
            <div className="live-panel-top">
              <div><span className="panel-kicker">BENCH MONITOR / DEMO MODE</span><h3>Light in. Signal out.</h3></div>
              <span className="status-pill"><i /> SIMULATED</span>
            </div>
            <div className="dye-picker" role="group" aria-label="Choose a dye label for the demonstration">
              {dyes.map((item) => (
                <button
                  className={`dye-button${selectedDye === item.id ? ' is-selected' : ''}`}
                  type="button"
                  key={item.id}
                  aria-pressed={selectedDye === item.id}
                  onClick={() => setSelectedDye(item.id)}
                >
                  <i style={{ backgroundColor: item.color }} />{item.label}
                </button>
              ))}
            </div>
            <div className="control-row">
              <label htmlFor="light-slider" className="slider-label">Relative light</label>
              <output htmlFor="light-slider" className="slider-output">{effectiveLight}%</output>
              <input
                id="light-slider"
                className="light-slider"
                type="range"
                min="0"
                max="100"
                value={light}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setLight(Number(event.target.value))}
                aria-label="Relative light level for the simulated dashboard"
              />
              <div className="range-ends"><span>covered</span><span>bright</span></div>
            </div>
            <div className="dashboard-actions">
              <button className="cover-button" type="button" aria-pressed={covered} onClick={() => setCovered((value) => !value)}>
                <span className="cover-icon" aria-hidden="true">{covered ? '◌' : '◒'}</span>{covered ? 'Uncover the sensor' : 'Cover the sensor'}
              </button>
              <button className="pause-button" type="button" aria-pressed={!running} onClick={() => setRunning((value) => !value)}>
                {running ? 'Ⅱ Pause demo' : '▶ Resume demo'}
              </button>
            </div>
            <div className="meter-row">
              <div className="readout-box">
                <span className="readout-label">CELL VOLTAGE</span>
                <strong>{currentValue}<small>mV</small></strong>
                <span className="readout-foot">illustrative only</span>
              </div>
              <div className="readout-box light-readout">
                <span className="readout-label">LIGHT SENSOR</span>
                <strong>{sensorCount}<small>/ 1023</small></strong>
                <span className="readout-foot">relative ADC count</span>
              </div>
            </div>
            <div className="chart-shell">
              <div className="chart-heading"><span>VOLTAGE / TIME</span><span>TRACE: SYNTHETIC</span></div>
              <svg viewBox="0 0 650 230" role="img" aria-label={`Synthetic demonstration line chart showing ${currentValue} millivolts at ${effectiveLight} percent relative light`} className="dashboard-chart">
                <line x1="50" y1="43" x2="596" y2="43" className="chart-grid-line" />
                <line x1="50" y1="93" x2="596" y2="93" className="chart-grid-line" />
                <line x1="50" y1="143" x2="596" y2="143" className="chart-grid-line" />
                <line x1="50" y1="193" x2="596" y2="193" className="chart-axis" />
                <line x1="50" y1="43" x2="50" y2="193" className="chart-axis" />
                <text x="39" y="47" textAnchor="end" className="chart-tick">450</text>
                <text x="39" y="97" textAnchor="end" className="chart-tick">300</text>
                <text x="39" y="147" textAnchor="end" className="chart-tick">150</text>
                <text x="39" y="197" textAnchor="end" className="chart-tick">0</text>
                <text x="50" y="218" className="chart-tick">0 s</text>
                <text x="596" y="218" textAnchor="end" className="chart-tick">20 s</text>
                <polyline points={graphPoints} fill="none" stroke={dye.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={lastPoint[0]} cy={lastPoint[1]} r="5.5" fill={dye.color} stroke="#183b34" strokeWidth="2" />
              </svg>
              <div className="chart-legend"><span><i style={{ backgroundColor: dye.color }} />{dye.label} label</span><span>not experimental data</span></div>
            </div>
            <p className="simulation-note"><b>Honest demo:</b> light level changes this synthetic trace. Picking another berry only changes the line colour; no dye is ranked or assigned a made-up result.</p>
          </div>
        </div>
        <details className="hardware-walkthrough">
          <summary><span>HOW TO TURN THIS DEMO INTO A REAL DASHBOARD</span><b>Open the wiring + data steps <i aria-hidden="true">＋</i></b></summary>
          <div className="hardware-walkthrough-body">
            <div className="hardware-step"><span>01</span><div><b>Read the light sensor</b><p>Connect the LDR module’s analog output to A0. Arduino <code>analogRead</code> gives raw ADC counts, not lux; call the reading “relative light” unless calibrated. <a className="claim-source" href="#source-arduino">[S3]</a></p></div></div>
            <div className="hardware-step"><span>02</span><div><b>Buffer the cell voltage</b><p>Confirm polarity and open-circuit voltage on a multimeter first. Use a high-input-impedance buffer before A1 and the correct common ground. Do not power the UNO from the cell.</p></div></div>
            <div className="hardware-step"><span>03</span><div><b>Send a clean serial row</b><p>Have the Arduino output time, light count and buffered voltage as comma-separated fields, for example <code>milliseconds,adc_count,voltage_mV</code>. The browser mock-up does not read a USB serial port.</p></div></div>
            <div className="hardware-step"><span>04</span><div><b>Test one condition at a time</b><p>Hold distance and cell area steady, switch from uncovered to covered, repeat the measurement, then graph the real readings in a serial plotter or laptop script. <a className="claim-source" href="#source-method">[S2]</a></p></div></div>
          </div>
        </details>
      </div>
    </section>
  );
}

function Investigation() {
  const [trials, setTrials] = useState<Record<DyeId, string[]>>(() => {
    const empty: Record<DyeId, string[]> = { blackberry: ['', '', ''], blueberry: ['', '', ''], jamun: ['', '', ''] };
    try {
      const saved = JSON.parse(localStorage.getItem('berry-trials-v1') || 'null');
      if (saved && dyes.every(({ id }) => Array.isArray(saved[id]) && saved[id].length === 3 && saved[id].every((v: unknown) => typeof v === 'string'))) return saved;
    } catch { /* Storage may be unavailable or contain invalid data. */ }
    return empty;
  });

  useEffect(() => {
    try { localStorage.setItem('berry-trials-v1', JSON.stringify(trials)); } catch { /* The guide remains usable without storage. */ }
  }, [trials]);

  const averages = useMemo(() => {
    const result = {} as Record<DyeId, { mean: number | null; count: number }>;
    dyes.forEach(({ id }) => {
      const values = trials[id]
        .filter((value) => value.trim() !== '')
        .map(Number)
        .filter((value) => Number.isFinite(value) && value >= 0);
      result[id] = {
        mean: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
        count: values.length,
      };
    });
    return result;
  }, [trials]);

  const readingCount = dyes.reduce((sum, item) => sum + averages[item.id].count, 0);
  const maxMean = Math.max(1, ...dyes.map((item) => averages[item.id].mean ?? 0));

  const updateTrial = (id: DyeId, index: number, value: string) => {
    setTrials((previous) => ({
      ...previous,
      [id]: previous[id].map((trial, trialIndex) => trialIndex === index ? value : trial),
    }));
  };

  const clearTrials = () => setTrials({ blackberry: ['', '', ''], blueberry: ['', '', ''], jamun: ['', '', ''] });

  return (
    <section className="section investigation-section" id="investigation">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Make it a fair investigation"
          title="Which dye performs best under your conditions?"
          copy="Compare three natural dyes using the same cell area, light, distance, soak time and measurement routine. The plot is blank on purpose—enter your own readings."
        />
        <div className="investigation-grid">
          <div className="trial-entry-card">
            <div className="trial-card-head"><div><span className="panel-kicker">YOUR NOTEBOOK / OPEN-CIRCUIT VOLTAGE</span><h3>Log three independent cells per dye.</h3></div><span className="n-marker">n = 3</span></div>
            <div className="trial-table-head"><span>DYE SAMPLE</span><span>REPEAT READINGS / mV</span><span>MEAN</span></div>
            {dyes.map((item) => {
              const mean = averages[item.id].mean;
              return (
                <div className="trial-row" key={item.id}>
                  <div className="trial-dye"><i style={{ backgroundColor: item.color }} />{item.label}</div>
                  <div className="trial-inputs">
                    {trials[item.id].map((value, index) => (
                      <label className="trial-input-label" key={`${item.id}-${index}`}>
                        <span className="sr-only">{item.label} repeat {index + 1} open-circuit voltage in millivolts</span>
                        <input
                          type="number"
                          min="0"
                          max="2000"
                          step="1"
                          inputMode="decimal"
                          value={value}
                          placeholder="—"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => updateTrial(item.id, index, event.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                  <strong className="trial-mean">{mean === null ? '—' : `${Math.round(mean)} mV`}</strong>
                </div>
              );
            })}
            <p className="trial-storage-note">Trial readings are saved on this device. Clearing browser or app data removes them.</p>
            <div className="trial-card-foot"><span>{readingCount} reading{readingCount === 1 ? '' : 's'} logged</span><button type="button" onClick={clearTrials}>Clear entries <span aria-hidden="true">×</span></button></div>
          </div>
          <div className="comparison-card">
            <div className="comparison-card-head"><span className="panel-kicker">MEASURED VALUES ONLY</span><span className="chart-unit">mV</span></div>
            <h3>Average voltage</h3>
            <div className="comparison-bars" role="img" aria-label="Bar chart of the average open-circuit voltages entered for each berry dye">
              {dyes.map((item) => {
                const value = averages[item.id].mean;
                const width = value === null ? 0 : Math.max(0, (value / maxMean) * 100);
                return (
                  <div className="comparison-bar-row" key={item.id}>
                    <span className="comparison-label">{item.label}</span>
                    <div className="comparison-track"><div className="comparison-fill" style={{ width: `${width}%`, backgroundColor: item.color }} /></div>
                    <strong>{value === null ? '—' : Math.round(value)}</strong>
                  </div>
                );
              })}
            </div>
            <p className="comparison-status" aria-live="polite">
              {readingCount === 0 ? 'No readings entered. Empty bars are intentional—not sample results.' : `${readingCount} student-entered reading${readingCount === 1 ? '' : 's'} · averages update as you type.`}
            </p>
            <div className="power-note"><b>Voltage is not power.</b> Open-circuit voltage alone cannot give power. For a power comparison, use a known load and measure voltage across it and current through it: <code>P = V × I</code>. <a className="claim-source" href="#source-method">[S2]</a></div>
          </div>
        </div>
        <PowerCalculator />
        <div className="fair-test-strip">
          <span className="fair-test-title">HOLD THESE CONSTANT</span>
          <span>cell area</span><i />
          <span>dye soak time</span><i />
          <span>lamp distance</span><i />
          <span>test duration</span><i />
          <span>meter range</span>
        </div>
        <p className="comparison-caveat">Report “best under our test conditions,” not “this fruit is always best.” Handmade-cell assembly differences can affect the result.</p>
      </div>
    </section>
  );
}

function PowerCalculator() {
  const [millivolts, setMillivolts] = useState('');
  const [resistance, setResistance] = useState('');
  const hasBothInputs = millivolts.trim() !== '' && resistance.trim() !== '';
  const voltageValue = Number(millivolts);
  const resistanceValue = Number(resistance);
  const currentValue = voltageValue / resistanceValue;
  const powerValue = voltageValue * voltageValue / resistanceValue;
  const valid = hasBothInputs && Number.isFinite(voltageValue) && Number.isFinite(resistanceValue) && voltageValue >= 0 && voltageValue <= 2000 && resistanceValue > 0 && Number.isFinite(currentValue) && Number.isFinite(powerValue);
  const currentMilliAmps = valid ? currentValue : null;
  const powerMicroWatts = valid ? powerValue : null;
  const tidy = (value: number) => Number(value.toPrecision(3)).toLocaleString('en-IN');

  return (
    <section className="power-calculator" aria-labelledby="power-calc-title">
      <div className="power-calc-intro">
        <span className="panel-kicker">THE POWER CHECK / LOADED CELL</span>
        <h3 id="power-calc-title">Voltage becomes power only under load.</h3>
        <p>Enter a voltage measured <b>across a known resistor connected to the cell</b>. The calculator uses Ohm’s law to infer current, then calculates power. Leave it blank until you have real readings.</p>
        <div className="power-formula-large"><span>P = V × I</span><i>or</i><span>P = V² / R</span></div>
        <p className="calc-warning"><b>Do not enter open-circuit voltage.</b> Voc is measured with no load, so it cannot tell you the cell’s power output.</p>
      </div>
      <div className="power-calc-workspace">
        <div className="power-inputs">
          <label>Measured voltage across load <span>mV</span>
            <input type="number" min="0" max="2000" step="any" inputMode="decimal" value={millivolts} placeholder="e.g. your reading" onChange={(event: ChangeEvent<HTMLInputElement>) => setMillivolts(event.target.value)} />
          </label>
          <label>Load resistance <span>Ω</span>
            <input type="number" step="any" inputMode="decimal" value={resistance} placeholder="resistor value" onChange={(event: ChangeEvent<HTMLInputElement>) => setResistance(event.target.value)} />
          </label>
        </div>
        <div className="power-results" aria-live="polite">
          <div><span>INFERRED CURRENT</span><b>{currentMilliAmps === null ? '—' : tidy(currentMilliAmps)}<small>mA</small></b><code>I = V / R</code></div>
          <div><span>LOAD POWER</span><b>{powerMicroWatts === null ? '—' : tidy(powerMicroWatts)}<small>µW</small></b><code>P = V × I</code></div>
        </div>
        <p className="power-calc-status" role="status">
          {!hasBothInputs ? 'Waiting for your measured loaded voltage and resistor value.' : !valid ? 'Enter a voltage from 0 to 2000 mV and a resistance greater than 0 Ω.' : 'Calculated from your inputs only; this is not a predicted or measured cell result.'}
        </p>
      </div>
    </section>
  );
}

function ExhibitionBoard() {
  return (
    <figure className="exhibit-board-wrap">
      <div className="board-topline"><span>FIG. 06 / EXHIBITION LAYOUT</span><span>ILLUSTRATIVE SCENE</span></div>
      <img
        className="science-fair-image"
        src="/images/science-fair-demo.jpg"
        alt="Illustrative school exhibit showing a small berry DSSC in a clear holder, berry samples, a lamp, wiring and a laptop with an unlabeled line plot."
        loading="lazy"
      />
      <figcaption className="board-caption">Generated display mock-up. The laptop trace is decorative only—show your own measured data, labelled cell diagram and real dye samples.</figcaption>
    </figure>
  );
}

function Showcase() {
  const buildSteps = [
    { n: '01', title: 'Check one cell first', text: 'Assemble a single pre-coated kit cell exactly as instructed.', detail: 'Connect the multimeter across the cell and confirm that the reading changes between light and shade. If there is no stable signal, re-check contact points and assembly before building the dashboard.', check: 'A repeatable voltage response is visible on the meter.' },
    { n: '02', title: 'Prepare and label each dye', text: 'Crush dark berries, filter the juice, and label the extracts.', detail: 'Use separate, clean cups and filters for blackberry, blueberry and jamun. Keep soaking time, dye volume and electrode area the same. Do not eat any experimental samples.', check: 'Each sample has a clear label and a recorded soak time.' },
    { n: '03', title: 'Take controlled readings', text: 'Change light, not several variables at once.', detail: 'Keep the same lamp or sunlight, distance, cell angle and test duration. Measure uncovered and covered conditions, let the cell cool between lamp tests, and repeat each dye with independent cells.', check: 'Your notebook has all trials, conditions and units—not only the best value.' },
    { n: '04', title: 'Add the sensor dashboard', text: 'Read the LDR and buffered voltage; send serial data over USB.', detail: 'The LDR gives raw ADC counts, not lux by default. The DSSC needs a high-input-impedance buffer and a multimeter check. USB powers the UNO; the berry cell does not.', check: 'Light counts and buffered voltage move in the expected direction when you cover the setup.' },
    { n: '05', title: 'Compare and explain', text: 'Show three independent cells per dye and calculate averages.', detail: 'Plot every repeat, state the test conditions, and discuss assembly variation. Say “best under our conditions,” not “this dye is always best.” Use voltage across a known load if you want to compare power.', check: 'Judges can see your method, raw readings, mean and limitations.' },
  ];

  return (
    <section className="section showcase-section" id="showcase">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="From workbench to exhibition table"
          title="Build in this order. Show the evidence."
          copy="Open each step for the practical action and a quick check. Prove a working cell first, then add sensors and code; that keeps the project chemistry-led."
        />
        <div className="showcase-grid">
          <div className="build-track">
            {buildSteps.map((step, index) => (
              <details className="build-step" key={step.n} open={index === 0}>
                <summary>
                  <span className="build-step-num">{step.n}</span>
                  <span className="build-step-copy"><b>{step.title}</b><span>{step.text}</span></span>
                  <span className="build-step-toggle" aria-hidden="true">＋</span>
                </summary>
                <div className="build-step-body"><p>{step.detail}</p><div><b>READY TO MOVE ON WHEN</b><span>{step.check}</span></div></div>
              </details>
            ))}
          </div>
          <ExhibitionBoard />
        </div>
        <div className="safety-strip">
          <div className="safety-symbol" aria-hidden="true">!</div>
          <div><span className="panel-kicker">SAFETY & CLAIMS</span><p>Wear eye protection and gloves; a teacher supervises electrolyte handling and any heat-treatment step. Do not eat the samples. Keep the cell cool. A small classroom DSSC is for measurement—not phone charging or lighting an LED as a guaranteed outcome. <a className="claim-source" href="#source-science">[S1]</a></p></div>
          <a className="text-link" href="#sources">Source notes <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

type BudgetItem = {
  id: string;
  name: string;
  detail: string;
  amount: number;
  ref: string;
  href?: string;
  color: string;
};

const budgetItems: BudgetItem[] = [
  { id: 'kit', name: '15-cell educational DSSC kit', detail: 'Conductive glass, pre-coated TiO₂ electrodes, electrolyte and assembly supplies. Landed-cost allowance, not a quote.', amount: 10100, ref: 'P1', href: links.kit, color: 'berry' },
  { id: 'uno', name: 'UNO R3-compatible board + USB cable', detail: 'Budget rounds a vendor listing of ₹275.22 to ₹280.', amount: 280, ref: 'P2', href: links.uno, color: 'leaf' },
  { id: 'ldr', name: 'LDR light-sensor module', detail: 'Relative light reading for the live graph; not a calibrated lux meter.', amount: 39, ref: 'P3', href: links.ldr, color: 'sun' },
  { id: 'buffer', name: 'High-impedance voltage buffer parts', detail: 'MCP6002 DIP op-amp + socket/passives allowance; adult help for assembly and calibration.', amount: 350, ref: 'P4', href: links.buffer, color: 'blue' },
  { id: 'breadboard', name: 'Breadboard + jumper-wire kit', detail: 'UNO and sensor prototyping; includes a breadboard and jumper leads.', amount: 299, ref: 'P5', href: links.breadboard, color: 'slate' },
  { id: 'meter', name: 'Digital multimeter', detail: '₹500 planning allowance based on a listed meter price before GST; borrow one if school has it.', amount: 500, ref: 'P6', href: links.meter, color: 'gold' },
  { id: 'resistors', name: 'Known-load resistor assortment', detail: 'Lets you test voltage across a known load; calculate current and power instead of treating Voc as power.', amount: 339, ref: 'P7', href: links.resistors, color: 'plum' },
  { id: 'fruit', name: 'Berries, filter paper, cups', detail: 'Local purchase allowance; actual fruit and consumable prices vary by season and location.', amount: 300, ref: 'L1', color: 'berry-soft' },
  { id: 'ppe', name: 'Gloves + safety glasses', detail: 'Local allowance. Use school PPE if available; adult supervision is still required.', amount: 250, ref: 'L1', color: 'green-soft' },
];

function BudgetSection() {
  const [hasMultimeter, setHasMultimeter] = useState(false);
  const [includeOled, setIncludeOled] = useState(false);
  const activeRows = budgetItems.map((item) => ({
    ...item,
    amount: item.id === 'meter' && hasMultimeter ? 0 : item.amount,
    borrowed: item.id === 'meter' && hasMultimeter,
  }));
  if (includeOled) {
    activeRows.push({
      id: 'oled', name: 'Optional 0.96-inch OLED', detail: 'Tiny local readout; not needed when the laptop dashboard is used.', amount: 209, ref: 'P8', href: links.oled, color: 'oled', borrowed: false,
    });
  }
  const subtotal = activeRows.reduce((sum, row) => sum + row.amount, 0);
  const reserve = Math.ceil(subtotal * 0.1);
  const total = subtotal + reserve;
  const barRows = [...activeRows.filter((row) => row.amount > 0), {
    id: 'contingency', name: '10% contingency', detail: 'Shipping and small price changes', amount: reserve, ref: '10%', color: 'contingency', borrowed: false,
  }];

  return (
    <section className="section budget-section" id="budget">
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow="An India-facing planning budget"
          title="What the build costs, line by line."
          copy="Recommended scope: one 15-cell kit, three dye samples × three independent cells, and a USB-powered sensor dashboard. All amounts are estimates—not a supplier quote."
        />
        <div className="budget-layout">
          <div className="budget-breakdown-card">
            <div className="budget-card-top"><span>BUILD COST / INR</span><span>PRICE LINKS: P1–P8</span></div>
            <div className="budget-visual" role="img" aria-label={`Budget composition, total ${money(total)} including ten percent contingency`}>
              {barRows.map((row) => <span key={row.id} className={`budget-segment segment-${row.color}`} style={{ flexBasis: `${Math.max((row.amount / (total || 1)) * 100, 0.15)}%` }} title={`${row.name}: ${money(row.amount)}`} />)}
            </div>
            <div className="budget-row-list">
              {budgetItems.map((item) => {
                const borrowed = item.id === 'meter' && hasMultimeter;
                return (
                  <div className={`budget-row${borrowed ? ' is-borrowed' : ''}`} key={item.id}>
                    <span className={`budget-swatch segment-${item.color}`} aria-hidden="true" />
                    <div className="budget-item-copy"><b>{item.name}</b><span>{borrowed ? 'Already owned / borrowed; removed from total.' : item.detail}</span></div>
                    <div className="budget-item-price"><strong>{borrowed ? '₹0' : money(item.amount)}</strong><a href={item.href ? `${item.href}#source` : '#source-assumptions'}>{item.ref}</a></div>
                  </div>
                );
              })}
              {includeOled && (
                <div className="budget-row">
                  <span className="budget-swatch segment-oled" aria-hidden="true" />
                  <div className="budget-item-copy"><b>Optional 0.96-inch OLED</b><span>Small local readout; browser dashboard already works without it.</span></div>
                  <div className="budget-item-price"><strong>₹209</strong><a href={`${links.oled}#source`}>P8</a></div>
                </div>
              )}
            </div>
            <div className="budget-controls">
              <label className="check-control"><input type="checkbox" checked={hasMultimeter} onChange={(event) => setHasMultimeter(event.target.checked)} /><span className="custom-check" /><span>I can borrow a multimeter <b>−₹500</b></span></label>
              <label className="check-control"><input type="checkbox" checked={includeOled} onChange={(event) => setIncludeOled(event.target.checked)} /><span className="custom-check" /><span>Add optional OLED <b>+₹209</b></span></label>
            </div>
            <div className="budget-math">
              <div><span>Items subtotal</span><b>{money(subtotal)}</b></div>
              <div><span>10% contingency</span><b>{money(reserve)}</b></div>
              <div className="grand-total"><span>Estimated total</span><strong>{money(total)}</strong></div>
            </div>
          </div>
          <aside className="budget-notes">
            <span className="estimate-stamp">TOTAL<br />ESTIMATE</span>
            <p className="total-big">{money(total)}</p>
            <p className="total-caption">recommended build · with a 10% reserve</p>
            <div className="budget-note-line"><b>Kit allowance</b><p>Vendor lists the 15-cell kit at US$89.99. For planning only: US$89.99 × ₹90 ≈ ₹8,099, plus an assumed ₹2,000 for freight/import gives a rounded ₹10,100. The vendor has not quoted an India-delivered price.</p></div>
            <div className="budget-note-line"><b>Assumed already available</b><p>Laptop, USB power, a cool lamp or daylight, and teacher-supervised workspace. No phone charging or LED output is included as a promise.</p></div>
            <div className="budget-note-line"><b>Lower the bill</b><p>Borrow the multimeter and PPE from school. Check local science suppliers for a kit with the same pre-coated electrodes and electrolyte before importing.</p></div>
            <a className="budget-source-cta" href="#sources">Open every price source <span aria-hidden="true">↘</span></a>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SourcesSection() {
  return (
    <section className="section sources-section" id="sources">
      <div className="shell">
        <SectionHeading
          index="07"
          eyebrow="Sources, assumptions & receipts"
          title="The science and the shopping list are traceable."
          copy="Science references support the explanation and method. Product links support indicative component prices; check availability, delivery and taxes before ordering."
        />
        <div className="source-columns">
          <div className="source-group science-sources">
            <div className="source-group-head"><span>01 / SCIENCE & METHOD</span><span>READ FIRST</span></div>
            <article className="source-entry" id="source-science">
              <span className="source-code">S1</span>
              <div><h3>NISE Network · DSSC Facilitator Guide</h3><p>Cell materials, assembly overview and safety guidance for a dye-sensitized solar cell activity.</p><a href={links.nisenet} target="_blank" rel="noreferrer">Open facilitator guide <span aria-hidden="true">↗</span></a></div>
            </article>
            <article className="source-entry" id="source-method">
              <span className="source-code">S2</span>
              <div><h3>Vanderbilt Young Scientist Journal · DSSC study</h3><p>Explains dye excitation, electron injection into TiO₂, redox regeneration and why performance comparisons need controlled conditions.</p><a href={links.vanderbilt} target="_blank" rel="noreferrer">Open student research article <span aria-hidden="true">↗</span></a></div>
            </article>
            <article className="source-entry" id="source-arduino">
              <span className="source-code">S3</span>
              <div><h3>Arduino · analogRead reference</h3><p>Official reference for reading analog input values on an Arduino-compatible board.</p><a href={links.arduino} target="_blank" rel="noreferrer">Open Arduino documentation <span aria-hidden="true">↗</span></a></div>
            </article>
          </div>
          <div className="source-group price-sources">
            <div className="source-group-head"><span>02 / PRICE REFERENCES</span><span>INR ESTIMATE · 10 NOV 2026</span></div>
            <div className="price-source-grid">
              <a className="price-source" id="source-kit" href={links.kit} target="_blank" rel="noreferrer"><span>P1 · DSSC KIT</span><b>US$89.99 / 15-cell kit</b><small>Overseas listing includes conductive glass, pre-deposited TiO₂ electrodes and electrolyte. Delivery to India is unconfirmed.</small><i>Open kit listing ↗</i></a>
              <a className="price-source" id="source-uno" href={links.uno} target="_blank" rel="noreferrer"><span>P2 · UNO + USB</span><b>₹275.22 listing</b><small>UNO R3-compatible clone and cable; rounded to ₹280 in the budget.</small><i>Open Robu listing ↗</i></a>
              <a className="price-source" id="source-ldr" href={links.ldr} target="_blank" rel="noreferrer"><span>P3 · LDR MODULE</span><b>₹39 listing</b><small>LM393 photosensitive light-dependent resistor sensor module.</small><i>Open Robu listing ↗</i></a>
              <a className="price-source" id="source-buffer" href={links.buffer} target="_blank" rel="noreferrer"><span>P4 · BUFFER IC</span><b>₹223.02 listing</b><small>MCP6002 DIP amplifier reference; ₹350 budget includes a socket and small passives allowance.</small><i>Open DNA Tech listing ↗</i></a>
              <a className="price-source" id="source-breadboard" href={links.breadboard} target="_blank" rel="noreferrer"><span>P5 · BREADBOARD KIT</span><b>₹299 listing</b><small>MB102 breadboard, power module and jumper-wire set.</small><i>Open Robu listing ↗</i></a>
              <a className="price-source" id="source-meter" href={links.meter} target="_blank" rel="noreferrer"><span>P6 · MULTIMETER</span><b>₹399 before GST</b><small>Budget uses ₹500 as a rounded allowance for tax and small price variation.</small><i>Open ElectronicsComp listing ↗</i></a>
              <a className="price-source" id="source-resistors" href={links.resistors} target="_blank" rel="noreferrer"><span>P7 · LOAD RESISTORS</span><b>₹339 listing</b><small>Resistor assortment for checking a cell under a known load.</small><i>Open Robu listing ↗</i></a>
              <a className="price-source" id="source-oled" href={links.oled} target="_blank" rel="noreferrer"><span>P8 · OPTIONAL OLED</span><b>₹209 listing</b><small>Optional display module; excluded unless selected in the budget calculator.</small><i>Open Robu listing ↗</i></a>
            </div>
            <div className="source-assumption" id="source-assumptions"><b>L1 · Local allowances, not live quotes.</b><p>₹300 for berries, filter paper and cups; ₹250 for shared gloves and eye protection. These vary by school, season and location. The ₹90 per US dollar conversion and ₹2,000 kit landing buffer are planning assumptions, not quoted exchange, shipping or customs rates.</p></div>
          </div>
        </div>
        <div className="source-footnote"><span>PRICE NOTE</span><p>Vendor prices can change and some pages may be out of stock or exclude tax/shipping. The estimate is an order-planning guide, not a purchase guarantee. Product sourcing was checked for this page on 10 November 2026; reconfirm each listing before buying.</p></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <a className="brand footer-brand" href="#top"><BrandMark /><span><b>berry</b><small>to current</small></span></a>
        <p>Light makes the signal.<br /><b>The whole cell makes the science.</b></p>
        <a href="#top" className="back-top">Back to top ↑</a>
        <span className="footer-credit">A student project field guide · 2026</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to project</a>
      <Header />
      <main id="main">
        <section className="hero-section" id="top">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow"><span className="eyebrow-square" /> A SMART DYE-SENSITIZED SOLAR CELL</p>
              <h1>Can a berry<br /><em>make a current?</em></h1>
              <p className="hero-lede">Not on its own. Berry pigment is the light-harvesting part of a complete solar cell—where light, titanium dioxide, conductive glass and an electrolyte work together.</p>
              <div className="hero-actions">
                <a className="button-primary" href="#cell">Explore the cell <span aria-hidden="true">↓</span></a>
                <a className="button-secondary" href="#dashboard"><span className="button-play" aria-hidden="true">▶</span> Open dashboard</a>
              </div>
              <div className="hero-footline"><span><i /> REAL CHEMISTRY</span><span><i /> SMALL OUTPUT</span><span><i /> MEASURE, DON’T PROMISE</span></div>
              <div className="hero-stat-row">
                <div><b>5</b><span>cell layers<br />in the stack</span></div>
                <div><b>3×3</b><span>dye samples<br />for the test plan</span></div>
                <div><b>₹</b><span>itemized build<br />budget included</span></div>
              </div>
            </div>
            <HeroPhoto />
          </div>
          <div className="hero-bottom-rule shell"><span>LIGHT ENERGY</span><i /><span>PHOTOELECTROCHEMISTRY</span><i /><span>MEASURED OUTPUT</span></div>
        </section>

        <section className="truth-band" aria-label="Project truth check">
          <div className="shell truth-grid">
            <div className="truth-intro"><span className="truth-mark">!</span><div><small>START WITH THE TRUTH</small><b>Berry juice alone<br />does not make electricity.</b></div></div>
            <div className="truth-item"><span>01 / INPUT</span><b>Light supplies the energy.</b><p>Photons excite a dye molecule.</p></div>
            <div className="truth-item"><span>02 / MATERIAL</span><b>Berry pigment catches light.</b><p>It is one sensitizer in a DSSC.</p></div>
            <div className="truth-item"><span>03 / DEVICE</span><b>The full cell makes a signal.</b><p>Expect low power; measure it.</p></div>
          </div>
        </section>

        <CellAnatomy />
        <Mechanism />
        <Dashboard />
        <Investigation />
        <Showcase />
        <BudgetSection />
        <SourcesSection />
      </main>
      <Footer />
    </>
  );
}
