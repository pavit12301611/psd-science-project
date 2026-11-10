import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

const dyes = [
  { id: 'blackberry', label: 'Blackberry', short: 'BB', color: '#e6867d' },
  { id: 'blueberry', label: 'Blueberry', short: 'BL', color: '#8fb7ce' },
  { id: 'jamun', label: 'Jamun', short: 'JM', color: '#c991ad' },
] as const;

type DyeId = (typeof dyes)[number]['id'];

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

function ExplodedCellIllustration() {
  return (
    <div className="exploded-figure-wrap">
      <div className="exploded-caption"><span>FIG. 02 / EXPLODED VIEW</span><span>FIVE WORKING PARTS</span></div>
      <svg className="exploded-svg" viewBox="0 0 560 420" role="img" aria-labelledby="exploded-title exploded-desc">
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

        <g>
          <rect x="110" y="54" width="345" height="27" fill="#c9dcd7" stroke="#456c66" strokeWidth="1.5" />
          <rect x="110" y="84" width="345" height="8" fill="#83aaa1" stroke="#456c66" strokeWidth="1.2" />
          <path d="M78 67h26M457 67h27" stroke="#6f7a70" />
          <circle cx="60" cy="67" r="12" fill="#163d35" /><text x="60" y="71" textAnchor="middle" className="svg-number">01</text>
          <text x="490" y="63" className="svg-mono">FTO GLASS</text><text x="490" y="78" className="svg-small">transparent collector</text>
        </g>
        <g>
          <rect x="110" y="111" width="345" height="42" fill="#e4eadc" stroke="#788b74" strokeWidth="1.3" />
          <rect x="110" y="111" width="345" height="42" fill="url(#particle-pattern)" />
          <circle cx="170" cy="119" r="4" fill="#ad424e" /><circle cx="228" cy="139" r="4" fill="#ad424e" />
          <circle cx="302" cy="122" r="4" fill="#ad424e" /><circle cx="372" cy="142" r="4" fill="#ad424e" />
          <circle cx="420" cy="120" r="4" fill="#ad424e" />
          <path d="M78 132h26M457 132h27" stroke="#6f7a70" />
          <circle cx="60" cy="132" r="12" fill="#163d35" /><text x="60" y="136" textAnchor="middle" className="svg-number">02</text>
          <text x="490" y="128" className="svg-mono">TiO₂ + DYE</text><text x="490" y="143" className="svg-small">porous semiconductor</text>
        </g>
        <g>
          <rect x="110" y="178" width="345" height="29" fill="#f0e3c2" stroke="#aa9565" strokeWidth="1.3" />
          <circle cx="190" cy="192" r="3" fill="#b69a55" /><circle cx="270" cy="193" r="3" fill="#b69a55" />
          <circle cx="353" cy="190" r="3" fill="#b69a55" /><circle cx="412" cy="195" r="3" fill="#b69a55" />
          <path d="M78 192h26M457 192h27" stroke="#6f7a70" />
          <circle cx="60" cy="192" r="12" fill="#163d35" /><text x="60" y="196" textAnchor="middle" className="svg-number">03</text>
          <text x="490" y="189" className="svg-mono">ELECTROLYTE</text><text x="490" y="204" className="svg-small">redox mediator</text>
        </g>
        <g>
          <rect x="110" y="233" width="345" height="13" fill="#414f49" />
          <path d="M78 239h26M457 239h27" stroke="#6f7a70" />
          <circle cx="60" cy="239" r="12" fill="#163d35" /><text x="60" y="243" textAnchor="middle" className="svg-number">04</text>
          <text x="490" y="236" className="svg-mono">COUNTER ELECTRODE</text><text x="490" y="251" className="svg-small">carbon / catalyst surface</text>
        </g>
        <g>
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
  const layers = [
    { n: '01', name: 'Conductive glass', label: 'FTO / ITO current collector', text: 'Lets light through and carries electrons from the photoanode into the wire.' },
    { n: '02', name: 'Porous titanium dioxide', label: 'TiO₂ semiconductor scaffold', text: 'A high-area surface for dye molecules; it accepts and transports injected electrons.' },
    { n: '03', name: 'Berry pigment', label: 'Natural sensitizer', text: 'Anthocyanin-rich dye absorbs part of the incoming light and becomes excited.' },
    { n: '04', name: 'Electrolyte', label: 'Iodide / triiodide redox pair', text: 'Transfers charge to help restore the oxidized dye and complete the cycle.' },
    { n: '05', name: 'Counter electrode', label: 'Carbon / catalytic surface', text: 'Closes the electrochemical circuit so the redox mediator can be regenerated.' },
  ];

  return (
    <section className="section anatomy-section" id="cell">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="A cell, not a juice trick"
          title="Five layers. One electron loop."
          copy="The berry supplies a sensitizing pigment. The complete DSSC turns light into a small electrical signal through photo-excitation and redox chemistry."
        />
        <div className="anatomy-grid">
          <ExplodedCellIllustration />
          <div className="layer-list">
            {layers.map((layer) => (
              <article className="layer-row" key={layer.n}>
                <span className="layer-number">{layer.n}</span>
                <div>
                  <h3>{layer.name}</h3>
                  <p className="layer-label">{layer.label}</p>
                  <p className="layer-copy">{layer.text}</p>
                </div>
                <span className="layer-dot" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
        <ComponentsPhoto />
        <aside className="kit-advice">
          <div className="advice-stamp">FIRST BUILD<br />TIP</div>
          <p><strong>Choose a kit with pre-coated TiO₂ and conductive glass.</strong> Ordinary window glass and random white TiO₂ powder do not make a reliable photoanode; electrode preparation and the kit’s electrolyte matter. <a href="#source-science">[S1]</a></p>
          <a className="text-link" href="#budget">See the kit allowance <span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </section>
  );
}

function Mechanism() {
  const steps = [
    { num: '01', title: 'Catch a photon', text: 'Berry dye attached to TiO₂ absorbs light and reaches an excited state.', icon: 'sun' },
    { num: '02', title: 'Inject an electron', text: 'The excited dye transfers an electron into the TiO₂ scaffold; the dye is left oxidized.', icon: 'spark' },
    { num: '03', title: 'Do circuit work', text: 'The electron reaches the conductive glass, passes through the external circuit and returns at the counter electrode.', icon: 'circuit' },
    { num: '04', title: 'Reset the dye', text: 'The electrolyte’s redox couple helps regenerate the dye and closes the electrochemical cycle.', icon: 'cycle' },
  ] as const;

  return (
    <section className="section mechanism-section" id="chemistry">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="The chemistry in four frames"
          title="Follow the charge, not just the colour."
          copy="This is the strongest science-fair explanation: light absorption → electron injection → external current → dye regeneration. [S1, S2]"
        />
        <div className="mechanism-track">
          {steps.map((step) => (
            <article className="mechanism-step" key={step.num}>
              <div className={`mechanism-icon icon-${step.icon}`} aria-hidden="true">
                {step.icon === 'sun' && <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="11" /><path d="M32 5v11M32 48v11M5 32h11M48 32h11M13 13l8 8M43 43l8 8M51 13l-8 8M21 43l-8 8" /></svg>}
                {step.icon === 'spark' && <svg viewBox="0 0 64 64"><path d="m35 5-17 28h13l-2 26 19-34H35l6-20Z" /><circle cx="13" cy="17" r="2" /><circle cx="52" cy="47" r="2" /></svg>}
                {step.icon === 'circuit' && <svg viewBox="0 0 64 64"><path d="M9 17h12v30H9M55 17H43v30h12M21 32h7m8 0h7" /><path d="m28 22 8 10-8 10" /><circle cx="9" cy="17" r="3" /><circle cx="55" cy="47" r="3" /></svg>}
                {step.icon === 'cycle' && <svg viewBox="0 0 64 64"><path d="M49 22a19 19 0 0 0-32-7l-5 5M15 42a19 19 0 0 0 32 7l5-5" /><path d="M12 10v10h10M52 54V44H42" /><text x="32" y="37" textAnchor="middle">I⁻</text></svg>}
              </div>
              <div className="mechanism-topline"><span>{step.num}</span><i /></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="reaction-strip">
          <span className="reaction-label">THE LOOP, SIMPLIFIED</span>
          <p><b>light</b> → dye* → e⁻ into TiO₂ → external load → redox electrolyte → <b>dye restored</b></p>
          <a href="#source-science">Read the source notes <span aria-hidden="true">↗</span></a>
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
        <p>Verify the cell with a multimeter. Use a high-impedance buffer before the Arduino input; power the board from USB, never from the berry cell. [S3]</p>
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
      </div>
    </section>
  );
}

function Investigation() {
  const [trials, setTrials] = useState<Record<DyeId, string[]>>({
    blackberry: ['', '', ''],
    blueberry: ['', '', ''],
    jamun: ['', '', ''],
  });

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
            <div className="power-note"><b>Voltage is not power.</b> Open-circuit voltage alone cannot give power. For a power comparison, use a known load and measure voltage across it and current through it: <code>P = V × I</code>. [S2]</div>
          </div>
        </div>
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
    { n: '01', title: 'Check the cell', text: 'Assemble a single pre-coated kit cell exactly as instructed. Find a measurable signal with the multimeter before adding code.' },
    { n: '02', title: 'Extract the dye', text: 'Crush dark berries, filter the juice, and label each sample. Keep all cells and soaking times consistent.' },
    { n: '03', title: 'Prove the response', text: 'Take repeated light and covered readings at the same distance. Avoid warming the cell with a strong lamp.' },
    { n: '04', title: 'Connect the sensors', text: 'Read the LDR and buffered cell voltage with the Arduino. Send readings to a laptop graph; USB powers the board.' },
    { n: '05', title: 'Compare fairly', text: 'Test three dyes with three independent cells each, calculate the mean and show every repeat—not just the best one.' },
  ];

  return (
    <section className="section showcase-section" id="showcase">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="From workbench to exhibition table"
          title="Build in this order. Show the evidence."
          copy="Prove a working cell first, then add sensors and code. That keeps the project chemistry-led instead of making the dashboard a decoration."
        />
        <div className="showcase-grid">
          <div className="build-track">
            {buildSteps.map((step) => (
              <article className="build-step" key={step.n}>
                <span className="build-step-num">{step.n}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </article>
            ))}
          </div>
          <ExhibitionBoard />
        </div>
        <div className="safety-strip">
          <div className="safety-symbol" aria-hidden="true">!</div>
          <div><span className="panel-kicker">SAFETY & CLAIMS</span><p>Wear eye protection and gloves; a teacher supervises electrolyte handling and any heat-treatment step. Do not eat the samples. Keep the cell cool. A small classroom DSSC is for measurement—not phone charging or lighting an LED as a guaranteed outcome. [S1]</p></div>
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
            <article className="source-entry">
              <span className="source-code">S2</span>
              <div><h3>Vanderbilt Young Scientist Journal · DSSC study</h3><p>Explains dye excitation, electron injection into TiO₂, redox regeneration and why performance comparisons need controlled conditions.</p><a href={links.vanderbilt} target="_blank" rel="noreferrer">Open student research article <span aria-hidden="true">↗</span></a></div>
            </article>
            <article className="source-entry">
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
