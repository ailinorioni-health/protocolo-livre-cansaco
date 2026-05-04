import { useState, useEffect } from 'react';

const PROTOCOLO_VERSION = 'v1';
const STORAGE_KEY = `protocolo-7d-${PROTOCOLO_VERSION}`;
const ACCESS_CODE = 'livre7d';

const COLORS = {
  terracota: '#C66B47',
  terracotaLight: '#F5E1D4',
  terracotaDeep: '#A1543A',
  salva: '#8B9D83',
  salvaLight: '#E5EBE2',
  salvaDeep: '#6F7E68',
  ocre: '#C9A66B',
  ocreLight: '#EBDBC0',
  ocreDeep: '#A88A4F',
  areia: '#E8DDD0',
  areiaSoft: '#F2EBE0',
  areiaDeep: '#D4C5B2',
  carvao: '#2B2A28',
  carvaoSoft: '#4A4845',
  carvaoMuted: '#6B6864',
  creme: '#FAF6F1',
  cremePuro: '#FFFFFF',
};

const DAYS_STRUCTURE = {
  0: { label: 'Avaliação inicial', title: 'Seu ponto de partida', relogio: null },
  1: {
    label: 'Dia 1', title: 'Reset Metabólico Matinal', relogio: 'corpo', color: 'terracota',
    checklists: [
      { id: 'agua', text: 'Beba 1 copo grande de água (300–500 ml)', detail: 'Antes do café. Antes do celular.' },
      { id: 'luz', text: 'Receba luz natural por pelo menos 5 min', detail: 'Janela aberta, varanda, ou um passo na rua.' },
      { id: 'proteina', text: 'Coma 20 g de proteína no café da manhã', detail: 'A proteína vem primeiro — sempre.' },
      { id: 'cafe', text: 'Tome café somente depois de comer', detail: 'Nunca em estômago vazio.' },
      { id: 'celular', text: 'Adie o celular pelos primeiros 30 minutos', detail: 'Sem redes, e-mail ou notícias.' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_meio_dia', label: 'Energia ao meio-dia' },
      { id: 'fome_real', label: 'Fome real antes do almoço' },
      { id: 'clareza', label: 'Clareza mental' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  2: {
    label: 'Dia 2', title: 'Reforço do Reset Matinal', relogio: 'corpo', color: 'terracota',
    checklists: [
      { id: 'agua', text: 'Beba 1 copo grande de água (300–500 ml)' },
      { id: 'luz', text: 'Receba luz natural por pelo menos 5 min' },
      { id: 'proteina', text: 'Coma 20 g de proteína no café da manhã' },
      { id: 'cafe', text: 'Tome café somente depois de comer' },
      { id: 'celular', text: 'Adie o celular pelos primeiros 30 minutos' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_meio_dia', label: 'Energia ao meio-dia' },
      { id: 'fome_real', label: 'Fome real antes do almoço' },
      { id: 'clareza', label: 'Clareza mental' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  3: {
    label: 'Dia 3', title: 'Estratégia Anti-Queda 15h', relogio: 'metabolismo', color: 'salva',
    checklists: [
      { id: 'manha', text: 'Manter o Reset Matinal de ontem', detail: 'Os ajustes são cumulativos.' },
      { id: 'proteina_almoco', text: 'Proteína primeiro no almoço (25–30 g)', detail: 'Ordem importa: proteína, fibra, carboidrato.' },
      { id: 'fibras', text: 'Vegetais ou folhas no almoço', detail: 'Metade do prato.' },
      { id: 'lanche', text: 'Lanche estratégico entre 14h–16h', detail: 'Proteína + gordura boa, pouco açúcar.' },
      { id: 'cafe_limite', text: 'Máximo 2 cafés, último até 14h', detail: 'Preserva o sono profundo da noite.' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_tarde', label: 'Energia à tarde (15h–17h)' },
      { id: 'compulsao', label: 'Compulsão por doce' },
      { id: 'foco_tarde', label: 'Foco no fim da tarde' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  4: {
    label: 'Dia 4', title: 'Reforço da Estabilidade', relogio: 'metabolismo', color: 'salva',
    checklists: [
      { id: 'manha', text: 'Manter o Reset Matinal' },
      { id: 'proteina_almoco', text: 'Proteína primeiro no almoço (25–30 g)' },
      { id: 'fibras', text: 'Vegetais ou folhas no almoço' },
      { id: 'lanche', text: 'Lanche estratégico entre 14h–16h' },
      { id: 'cafe_limite', text: 'Máximo 2 cafés, último até 14h' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_tarde', label: 'Energia à tarde' },
      { id: 'compulsao', label: 'Compulsão por doce' },
      { id: 'foco_tarde', label: 'Foco no fim da tarde' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  5: {
    label: 'Dia 5', title: 'Protocolo 3 Prioridades', relogio: 'mente', color: 'ocre',
    checklists: [
      { id: 'manha', text: 'Manter o Reset Matinal' },
      { id: 'tarde', text: 'Manter a Estratégia Anti-Queda' },
      { id: 'prioridades', text: 'Definir 3 prioridades reais para amanhã', detail: 'Não 5. Não 7. Três.' },
      { id: 'micro_decisoes', text: 'Eliminar 3 micro-decisões da manhã', detail: 'Roupa, café, agenda decididos hoje à noite.' },
      { id: 'celular_quarto', text: 'Celular fora do quarto', detail: 'Compre um despertador se precisar.' },
    ],
    scoreFields: [
      { id: 'energia_mental', label: 'Energia mental ao acordar' },
      { id: 'foco', label: 'Foco durante o dia' },
      { id: 'fim_produtivo', label: 'Sensação de fim de dia produtivo' },
      { id: 'sobrecarga', label: 'Ansiedade ou sobrecarga (10 = nenhuma)' },
    ],
  },
  6: { label: 'Dia 6', title: 'Ajuste fino — calibragem', relogio: null, isCalibration: true },
  7: { label: 'Dia 7', title: 'Reavaliação e integração', relogio: null, isFinal: true },
};

const SCORE_FIELDS_INITIAL = [
  { id: 'energia_acordar', label: 'Energia ao acordar' },
  { id: 'energia_manha', label: 'Energia no meio da manhã' },
  { id: 'energia_tarde', label: 'Energia à tarde (15h–17h)' },
  { id: 'energia_noite', label: 'Energia à noite' },
  { id: 'clareza', label: 'Clareza mental e foco' },
  { id: 'sono', label: 'Qualidade do sono' },
  { id: 'humor', label: 'Estabilidade de humor' },
  { id: 'compulsao', label: 'Vontade de doce / compulsão' },
];

// ============ PERSISTÊNCIA (localStorage) ============
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

// ============ COMPONENTES ============

function AccessGate({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.creme,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${COLORS.terracota}`, background: COLORS.terracotaLight }} />
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${COLORS.salva}`, background: COLORS.salvaLight }} />
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${COLORS.ocre}`, background: COLORS.ocreLight }} />
        </div>

        <p style={{
          fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
          color: COLORS.terracota, fontWeight: 500, marginBottom: '12px',
        }}>
          Protocolo Livre do Cansaço · 7 Dias
        </p>

        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '38px',
          fontWeight: 400, lineHeight: 1.05, color: COLORS.carvao,
          marginBottom: '14px', letterSpacing: '-0.5px',
        }}>
          Os 3 <em style={{ color: COLORS.terracota, fontWeight: 300 }}>Relógios</em><br />
          da Energia Estável
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '15px', color: COLORS.carvaoSoft,
          marginBottom: '40px', lineHeight: 1.5,
        }}>
          Digite o código de acesso<br />que você recebeu na compra.
        </p>

        <input
          type="text" value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Código de acesso" autoFocus
          style={{
            width: '100%', padding: '14px 16px', fontSize: '16px',
            fontFamily: 'inherit',
            border: `1px solid ${error ? '#D54343' : COLORS.areiaDeep}`,
            background: COLORS.cremePuro, borderRadius: '6px',
            color: COLORS.carvao, outline: 'none',
            textAlign: 'center', letterSpacing: '1px', marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ color: '#D54343', fontSize: '13px', marginBottom: '16px' }}>
            Código incorreto. Tente novamente.
          </p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '14px',
            background: COLORS.terracota, color: COLORS.cremePuro,
            border: 'none', borderRadius: '6px',
            fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Entrar no protocolo
        </button>

        <p style={{
          fontSize: '12px', color: COLORS.carvaoMuted,
          marginTop: '32px', fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
        }}>
          © Ailin Orioni · Protocolo Livre do Cansaço 7D™
        </p>
      </div>
    </div>
  );
}

function ScoreSelector({ value, onChange, color = COLORS.terracota }) {
  return (
    <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
      {[...Array(11)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            width: '26px', height: '26px', borderRadius: '50%',
            border: `1.5px solid ${color}`,
            background: value === i ? color : COLORS.cremePuro,
            color: value === i ? COLORS.cremePuro : color,
            cursor: 'pointer', fontSize: '11px', fontWeight: 500,
            padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

function Header({ data, currentDay }) {
  const completedDays = Object.keys(data.days || {}).filter(d => data.days[d].completed).length;
  const progress = Math.round((completedDays / 7) * 100);

  return (
    <div style={{
      background: COLORS.cremePuro, padding: '20px 20px 16px',
      borderBottom: `1px solid ${COLORS.areia}`,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <p style={{
            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
            color: COLORS.carvaoMuted, margin: 0, fontWeight: 500,
          }}>
            Protocolo Livre do Cansaço
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '13px', color: COLORS.terracota, margin: '2px 0 0',
          }}>
            Dia {currentDay} de 7
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.2px solid ${COLORS.terracota}`, background: completedDays >= 2 ? COLORS.terracota : COLORS.terracotaLight }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.2px solid ${COLORS.salva}`, background: completedDays >= 4 ? COLORS.salva : COLORS.salvaLight }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.2px solid ${COLORS.ocre}`, background: completedDays >= 5 ? COLORS.ocre : COLORS.ocreLight }} />
        </div>
      </div>

      <div style={{ height: '4px', background: COLORS.areia, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: COLORS.terracota, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

function DayNav({ currentDay, setCurrentDay, data }) {
  return (
    <div style={{
      display: 'flex', gap: '6px', padding: '12px 16px',
      background: COLORS.creme, overflowX: 'auto',
      borderBottom: `1px solid ${COLORS.areia}`,
    }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(d => {
        const dayData = data.days?.[d];
        const isComplete = dayData?.completed;
        const isCurrent = d === currentDay;
        const day = DAYS_STRUCTURE[d];
        const dayColor = day.color === 'salva' ? COLORS.salva : day.color === 'ocre' ? COLORS.ocre : COLORS.terracota;

        return (
          <button
            key={d} onClick={() => setCurrentDay(d)}
            style={{
              minWidth: '42px', height: '42px', borderRadius: '50%',
              border: `1.5px solid ${isCurrent ? dayColor : COLORS.areiaDeep}`,
              background: isComplete ? dayColor : isCurrent ? COLORS.cremePuro : 'transparent',
              color: isComplete ? COLORS.cremePuro : isCurrent ? dayColor : COLORS.carvaoMuted,
              fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Georgia, serif',
              flexShrink: 0, transition: 'all 0.2s',
            }}
          >
            {d === 0 ? '0' : d}
          </button>
        );
      })}
    </div>
  );
}

function DayInitial({ data, updateData, goToDay }) {
  const initial = data.initial || {};

  const updateInitial = (updates) => {
    updateData({ ...data, initial: { ...initial, ...updates } });
  };

  const updateScore = (field, value) => {
    updateInitial({ scores: { ...(initial.scores || {}), [field]: value } });
  };

  const allScored = SCORE_FIELDS_INITIAL.every(f => initial.scores?.[f.id] !== undefined);
  const total = SCORE_FIELDS_INITIAL.reduce((acc, f) => acc + (initial.scores?.[f.id] || 0), 0);

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: COLORS.terracota, margin: '0 0 8px', fontWeight: 500,
      }}>
        Antes de começar
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 4px',
        lineHeight: 1.1, letterSpacing: '-0.3px',
      }}>
        Seu <em style={{ color: COLORS.terracota, fontWeight: 300 }}>ponto de partida</em>.
      </h1>

      <p style={{
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '15px', color: COLORS.carvaoSoft,
        margin: '12px 0 24px', lineHeight: 1.5,
      }}>
        Antes de começar o protocolo, você precisa de uma fotografia de onde você está hoje. Esse é o número contra o qual você vai comparar tudo.
      </p>

      <div style={{
        background: COLORS.areiaSoft, padding: '16px 18px',
        borderRadius: '8px', marginBottom: '24px',
        border: `1px solid ${COLORS.areiaDeep}`,
      }}>
        <p style={{ fontSize: '14px', color: COLORS.carvaoSoft, margin: 0, lineHeight: 1.6 }}>
          Em uma escala de <strong>0 a 10</strong>, como você se sente hoje em cada item.<br />
          <em style={{ fontFamily: 'Georgia, serif' }}>Seja honesta. Ninguém vai ver isso além de você.</em>
        </p>
      </div>

      {SCORE_FIELDS_INITIAL.map(field => (
        <div key={field.id} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: COLORS.carvao, margin: '0 0 8px', fontWeight: 500 }}>
            {field.label}
          </p>
          <ScoreSelector
            value={initial.scores?.[field.id]}
            onChange={(v) => updateScore(field.id, v)}
          />
        </div>
      ))}

      <div style={{ marginTop: '28px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          Em qual momento do dia você sente mais queda?
        </p>
        <textarea
          value={initial.queda || ''}
          onChange={(e) => updateInitial({ queda: e.target.value })}
          rows={2} placeholder="Descreva o momento da queda…"
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que você acredita hoje que mais te cansa?
        </p>
        <textarea
          value={initial.causa || ''}
          onChange={(e) => updateInitial({ causa: e.target.value })}
          rows={3} placeholder="O que mais te cansa…"
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {allScored && (
        <div style={{
          marginTop: '32px', padding: '20px',
          background: COLORS.terracotaLight, borderRadius: '8px',
          borderLeft: `4px solid ${COLORS.terracota}`,
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            color: COLORS.terracotaDeep, fontWeight: 500, margin: '0 0 6px',
          }}>
            Score inicial
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontSize: '32px',
            color: COLORS.terracota, margin: 0, fontWeight: 400,
          }}>
            {total} <span style={{ fontSize: '18px', color: COLORS.carvaoMuted, fontStyle: 'italic' }}>/ 80</span>
          </p>
          <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, marginTop: '8px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
            Esse é o seu Dia 0. Volte aqui no Dia 7 para comparar.
          </p>
        </div>
      )}

      <button
        onClick={() => {
          updateInitial({ completed: true });
          goToDay(1);
        }}
        disabled={!allScored}
        style={{
          marginTop: '28px', width: '100%', padding: '14px',
          background: allScored ? COLORS.terracota : COLORS.areiaDeep,
          color: COLORS.cremePuro, border: 'none', borderRadius: '6px',
          fontSize: '15px', fontWeight: 500,
          cursor: allScored ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit', letterSpacing: '0.3px',
        }}
      >
        Começar o Dia 1 →
      </button>
    </div>
  );
}

function DayPage({ dayNum, data, updateData, goToDay }) {
  const day = DAYS_STRUCTURE[dayNum];
  const dayData = data.days?.[dayNum] || {};
  const dayColor = day.color === 'salva' ? COLORS.salva : day.color === 'ocre' ? COLORS.ocre : COLORS.terracota;
  const dayColorLight = day.color === 'salva' ? COLORS.salvaLight : day.color === 'ocre' ? COLORS.ocreLight : COLORS.terracotaLight;
  const dayColorDeep = day.color === 'salva' ? COLORS.salvaDeep : day.color === 'ocre' ? COLORS.ocreDeep : COLORS.terracotaDeep;

  const updateDayData = (updates) => {
    const newDays = { ...(data.days || {}) };
    newDays[dayNum] = { ...dayData, ...updates };
    updateData({ ...data, days: newDays });
  };

  const toggleCheck = (id) => {
    const checks = { ...(dayData.checks || {}) };
    checks[id] = !checks[id];
    updateDayData({ checks });
  };

  const updateScore = (field, value) => {
    updateDayData({ scores: { ...(dayData.scores || {}), [field]: value } });
  };

  const allChecked = day.checklists.every(c => dayData.checks?.[c.id]);
  const allScored = day.scoreFields.every(f => dayData.scores?.[f.id] !== undefined);
  const canComplete = allChecked && allScored;

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: dayColor, margin: '0 0 8px', fontWeight: 500,
      }}>
        {day.label} · Relógio {day.relogio === 'corpo' ? 'do Corpo' : day.relogio === 'metabolismo' ? 'do Metabolismo' : 'da Mente'}
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 24px',
        lineHeight: 1.15, letterSpacing: '-0.3px',
      }}>
        {day.title}
      </h1>

      <div style={{
        background: dayColorLight, padding: '6px 14px',
        borderRadius: '4px', display: 'inline-block',
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: dayColorDeep, fontWeight: 600, marginBottom: '14px',
      }}>
        Modo rápido · Checklist
      </div>

      <div style={{ marginBottom: '32px' }}>
        {day.checklists.map(item => {
          const checked = dayData.checks?.[item.id];
          return (
            <div
              key={item.id} onClick={() => toggleCheck(item.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 0', borderBottom: `1px solid ${COLORS.areia}`,
                cursor: 'pointer',
              }}
            >
              <div style={{
                flexShrink: 0, width: '22px', height: '22px',
                borderRadius: '4px', border: `1.5px solid ${dayColor}`,
                background: checked ? dayColor : COLORS.cremePuro,
                marginTop: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 6 L5 9 L10 3" stroke={COLORS.cremePuro} strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '15px', fontWeight: 500,
                  color: COLORS.carvao, margin: 0, lineHeight: 1.4,
                  textDecoration: checked ? 'line-through' : 'none',
                  opacity: checked ? 0.55 : 1,
                }}>
                  {item.text}
                </p>
                {item.detail && (
                  <p style={{
                    fontFamily: 'Georgia, serif', fontStyle: 'italic',
                    fontSize: '13px', color: COLORS.carvaoMuted,
                    margin: '4px 0 0', lineHeight: 1.4,
                  }}>
                    {item.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: COLORS.ocreLight, padding: '6px 14px',
        borderRadius: '4px', display: 'inline-block',
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: COLORS.ocreDeep, fontWeight: 600, marginBottom: '14px',
      }}>
        Registro · Como você se sentiu
      </div>

      {day.scoreFields.map(field => (
        <div key={field.id} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: COLORS.carvao, margin: '0 0 8px', fontWeight: 500 }}>
            {field.label}
          </p>
          <ScoreSelector
            value={dayData.scores?.[field.id]}
            onChange={(v) => updateScore(field.id, v)}
            color={dayColor}
          />
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que percebi de diferente hoje:
        </p>
        <textarea
          value={dayData.notes || ''}
          onChange={(e) => updateDayData({ notes: e.target.value })}
          rows={4} placeholder="Escreva livremente…"
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {dayData.completed ? (
        <div style={{
          marginTop: '28px', padding: '16px',
          background: dayColorLight, borderRadius: '8px',
          borderLeft: `4px solid ${dayColor}`, textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '15px', color: dayColorDeep, margin: 0, lineHeight: 1.5,
          }}>
            Dia {dayNum} concluído. {dayNum < 7 ? 'Continue amanhã.' : 'Você fechou o ciclo.'}
          </p>
        </div>
      ) : (
        <button
          onClick={() => {
            updateDayData({ completed: true });
            if (dayNum < 7) {
              setTimeout(() => goToDay(dayNum + 1), 300);
            }
          }}
          disabled={!canComplete}
          style={{
            marginTop: '28px', width: '100%', padding: '14px',
            background: canComplete ? dayColor : COLORS.areiaDeep,
            color: COLORS.cremePuro, border: 'none', borderRadius: '6px',
            fontSize: '15px', fontWeight: 500,
            cursor: canComplete ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', letterSpacing: '0.3px',
          }}
        >
          {canComplete ? `Finalizar Dia ${dayNum}` : 'Complete o checklist e o registro'}
        </button>
      )}
    </div>
  );
}

function DayCalibration({ data, updateData, goToDay }) {
  const dayData = data.days?.[6] || {};

  const updateField = (field, value) => {
    const newDays = { ...(data.days || {}) };
    newDays[6] = { ...dayData, [field]: value };
    updateData({ ...data, days: newDays });
  };

  const analyzeRelogios = () => {
    const days = data.days || {};
    const corpoScores = [1, 2].flatMap(d => Object.values(days[d]?.scores || {})).filter(v => v !== undefined);
    const metabolismoScores = [3, 4].flatMap(d => Object.values(days[d]?.scores || {})).filter(v => v !== undefined);
    const menteScores = Object.values(days[5]?.scores || {}).filter(v => v !== undefined);

    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      corpo: avg(corpoScores),
      metabolismo: avg(metabolismoScores),
      mente: avg(menteScores),
    };
  };

  const analysis = analyzeRelogios();
  const weakest = Object.entries(analysis).sort(([, a], [, b]) => a - b)[0];

  const recomendacoes = {
    corpo: ['Aumentar proteína no café da manhã (chegar a 25–30 g)', 'Garantir os 5 minutos de luz natural', 'Dormir 30 minutos mais cedo essa noite'],
    metabolismo: ['Aumentar proteína no almoço', 'Antecipar o lanche estratégico', 'Reduzir um café do dia', 'Revisar excesso de carboidrato'],
    mente: ['Reduzir prioridades de 3 para 2', 'Eliminar mais micro-decisões da manhã', 'Cortar 1 fonte de notificação', 'Revisar consumo de redes sociais'],
  };

  const labels = { corpo: 'Relógio do Corpo', metabolismo: 'Relógio do Metabolismo', mente: 'Relógio da Mente' };
  const colorMap = { corpo: COLORS.terracota, metabolismo: COLORS.salva, mente: COLORS.ocre };
  const colorMapLight = { corpo: COLORS.terracotaLight, metabolismo: COLORS.salvaLight, mente: COLORS.ocreLight };

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: COLORS.terracota, margin: '0 0 8px', fontWeight: 500,
      }}>
        Dia 6 · Ajuste fino
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 16px', lineHeight: 1.15,
      }}>
        Calibrando os <em style={{ color: COLORS.terracota, fontWeight: 300 }}>3 Relógios</em>.
      </h1>

      <p style={{
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '15px', color: COLORS.carvaoSoft,
        marginBottom: '24px', lineHeight: 1.5,
      }}>
        Você tem 5 dias de dados sobre você. Hoje vamos lê-los juntas.
      </p>

      <p style={{
        fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
        color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '12px',
      }}>
        Sua média por relógio
      </p>

      {Object.entries(analysis).map(([key, value]) => (
        <div key={key} style={{
          background: colorMapLight[key], padding: '14px 16px',
          borderRadius: '8px', marginBottom: '10px',
          borderLeft: `4px solid ${colorMap[key]}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, margin: 0 }}>
            {labels[key]}
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontSize: '20px',
            color: colorMap[key], margin: 0, fontWeight: 500,
          }}>
            {value.toFixed(1)}
          </p>
        </div>
      ))}

      <div style={{
        marginTop: '24px', padding: '20px',
        background: COLORS.cremePuro, borderRadius: '8px',
        border: `1px solid ${COLORS.areiaDeep}`,
      }}>
        <p style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: colorMap[weakest[0]], fontWeight: 600, marginBottom: '8px',
        }}>
          Onde reforçar amanhã
        </p>
        <p style={{
          fontFamily: 'Georgia, serif', fontSize: '18px',
          color: COLORS.carvao, margin: '0 0 12px', fontWeight: 500,
        }}>
          {labels[weakest[0]]}
        </p>
        <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, marginBottom: '12px', lineHeight: 1.5 }}>
          Esse é o relógio com média mais baixa nos últimos dias. Foque em reforçá-lo no Dia 7.
        </p>
        {recomendacoes[weakest[0]].map((rec, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0',
          }}>
            <span style={{ color: colorMap[weakest[0]], fontWeight: 600 }}>→</span>
            <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, margin: 0, lineHeight: 1.5 }}>
              {rec}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '28px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          Onde percebi a maior melhora?
        </p>
        <textarea
          value={dayData.melhora || ''}
          onChange={(e) => updateField('melhora', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que ainda está difícil de manter?
        </p>
        <textarea
          value={dayData.dificuldade || ''}
          onChange={(e) => updateField('dificuldade', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={() => {
          updateField('completed', true);
          setTimeout(() => goToDay(7), 300);
        }}
        style={{
          marginTop: '28px', width: '100%', padding: '14px',
          background: COLORS.terracota, color: COLORS.cremePuro,
          border: 'none', borderRadius: '6px',
          fontSize: '15px', fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Ir para o Dia 7 →
      </button>
    </div>
  );
}

function DayFinal({ data, updateData }) {
  const dayData = data.days?.[7] || {};
  const initial = data.initial || {};

  const updateField = (field, value) => {
    const newDays = { ...(data.days || {}) };
    newDays[7] = { ...dayData, [field]: value };
    updateData({ ...data, days: newDays });
  };

  const updateFinalScore = (field, value) => {
    updateField('scores', { ...(dayData.scores || {}), [field]: value });
  };

  const totalInitial = SCORE_FIELDS_INITIAL.reduce((acc, f) => acc + (initial.scores?.[f.id] || 0), 0);
  const totalFinal = SCORE_FIELDS_INITIAL.reduce((acc, f) => acc + (dayData.scores?.[f.id] || 0), 0);
  const allFinalScored = SCORE_FIELDS_INITIAL.every(f => dayData.scores?.[f.id] !== undefined);
  const diff = totalFinal - totalInitial;
  const diffPct = totalInitial > 0 ? Math.round((diff / totalInitial) * 100) : 0;

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: COLORS.terracota, margin: '0 0 8px', fontWeight: 500,
      }}>
        Dia 7 · Reavaliação
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 16px', lineHeight: 1.15,
      }}>
        Sete dias <em style={{ color: COLORS.terracota, fontWeight: 300 }}>depois</em>.
      </h1>

      <p style={{
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '15px', color: COLORS.carvaoSoft,
        marginBottom: '24px', lineHeight: 1.5,
      }}>
        Repita a mesma avaliação do início. Sem olhar a anterior. Como você se sente agora.
      </p>

      {SCORE_FIELDS_INITIAL.map(field => (
        <div key={field.id} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: COLORS.carvao, margin: '0 0 8px', fontWeight: 500 }}>
            {field.label}
          </p>
          <ScoreSelector
            value={dayData.scores?.[field.id]}
            onChange={(v) => updateFinalScore(field.id, v)}
          />
        </div>
      ))}

      {allFinalScored && (
        <div style={{
          marginTop: '32px', padding: '24px 20px',
          background: COLORS.cremePuro, borderRadius: '12px',
          border: `1px solid ${COLORS.terracota}`,
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            color: COLORS.terracotaDeep, fontWeight: 600,
            margin: '0 0 16px', textAlign: 'center',
          }}>
            Sua transformação
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: COLORS.carvaoMuted, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Dia 0
              </p>
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: '36px',
                color: COLORS.carvaoSoft, margin: '4px 0 0', fontWeight: 400,
              }}>
                {totalInitial}
              </p>
            </div>

            <div style={{ fontSize: '24px', color: COLORS.terracota }}>→</div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: COLORS.terracota, margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                Dia 7
              </p>
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: '36px',
                color: COLORS.terracota, margin: '4px 0 0', fontWeight: 500,
              }}>
                {totalFinal}
              </p>
            </div>
          </div>

          <div style={{
            background: COLORS.terracotaLight, padding: '14px',
            borderRadius: '8px', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '15px', color: COLORS.terracotaDeep,
              margin: 0, lineHeight: 1.5,
            }}>
              {diff > 0
                ? `+${diff} pontos · Sua energia subiu ${diffPct}% em sete dias.`
                : diff === 0
                ? 'Mesma pontuação. Olhe os scores individuais — o crescimento pode estar no detalhe.'
                : `${diff} pontos. Vale revisar com mais calma na próxima rodada do protocolo.`}
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p style={{
              fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '12px',
            }}>
              Detalhe por indicador
            </p>
            {SCORE_FIELDS_INITIAL.map(field => {
              const v0 = initial.scores?.[field.id] || 0;
              const v7 = dayData.scores?.[field.id] || 0;
              const d = v7 - v0;
              return (
                <div key={field.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: `1px solid ${COLORS.areia}`,
                }}>
                  <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, margin: 0, flex: 1 }}>
                    {field.label}
                  </p>
                  <p style={{ fontSize: '13px', color: COLORS.carvaoMuted, margin: 0, marginRight: '12px' }}>
                    {v0} → {v7}
                  </p>
                  <p style={{
                    fontSize: '13px', fontWeight: 600,
                    color: d > 0 ? COLORS.salva : d < 0 ? COLORS.terracota : COLORS.carvaoMuted,
                    margin: 0, minWidth: '32px', textAlign: 'right',
                  }}>
                    {d > 0 ? `+${d}` : d}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: '32px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          Onde a mudança foi mais clara?
        </p>
        <textarea
          value={dayData.mudanca || ''}
          onChange={(e) => updateField('mudanca', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que vou manter de agora em diante?
        </p>
        <textarea
          value={dayData.manter || ''}
          onChange={(e) => updateField('manter', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {allFinalScored && (
        <div style={{ marginTop: '32px', padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.terracota }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.salva }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.ocre }} />
          </div>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '20px', color: COLORS.carvao,
            lineHeight: 1.4, margin: '0 0 12px',
          }}>
            Você nunca foi o problema —<br />
            era só o sistema que estava<br />
            <em style={{ color: COLORS.terracota, fontWeight: 500 }}>desregulado</em>.
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '14px', color: COLORS.terracota, margin: 0,
          }}>
            — Ailin
          </p>
        </div>
      )}
    </div>
  );
}

// ============ APP PRINCIPAL ============

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState({ initial: {}, days: {} });
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadData();
    if (saved) {
      setData(saved);
      const days = saved.days || {};
      const completedDays = Object.keys(days).map(Number).filter(d => days[d].completed);
      const lastDay = completedDays.length ? Math.max(...completedDays) : 0;
      setCurrentDay(saved.initial?.completed ? Math.min(lastDay + 1, 7) : 0);
      if (saved.unlocked) setUnlocked(true);
    }
    setLoading(false);
  }, []);

  const updateData = (newData) => {
    setData(newData);
    saveData({ ...newData, unlocked: true });
  };

  const handleUnlock = () => {
    setUnlocked(true);
    saveData({ ...data, unlocked: true });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: COLORS.creme,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: COLORS.terracota }}>
          Carregando…
        </p>
      </div>
    );
  }

  if (!unlocked) {
    return <AccessGate onUnlock={handleUnlock} />;
  }

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.creme,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      maxWidth: '480px', margin: '0 auto',
    }}>
      <Header data={data} currentDay={currentDay} />
      <DayNav currentDay={currentDay} setCurrentDay={setCurrentDay} data={data} />

      {currentDay === 0 && (
        <DayInitial data={data} updateData={updateData} goToDay={setCurrentDay} />
      )}

      {currentDay >= 1 && currentDay <= 5 && (
        <DayPage dayNum={currentDay} data={data} updateData={updateData} goToDay={setCurrentDay} />
      )}

      {currentDay === 6 && (
        <DayCalibration data={data} updateData={updateData} goToDay={setCurrentDay} />
      )}

      {currentDay === 7 && (
        <DayFinal data={data} updateData={updateData} />
      )}

      <div style={{
        textAlign: 'center', padding: '20px',
        fontSize: '11px', color: COLORS.carvaoMuted,
        letterSpacing: '0.5px',
      }}>
        © Ailin Orioni · Protocolo Livre do Cansaço 7D™
      </div>
    </div>
  );
}
