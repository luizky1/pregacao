import { useMemo, useState } from 'react';
import {
  BookOpen, ChevronLeft, ChevronRight, Church, ClipboardCheck, Cross,
  Download, FileText, Heart, Lightbulb, Menu, Moon, Printer, ScrollText,
  Search, Sparkles, Sun, X
} from 'lucide-react';

const STEPS = [
  ['Objetivo', 'Defina com precisão o fruto que deseja produzir nos ouvintes.'],
  ['Oração', 'Coloque a preparação sob a ação do Espírito Santo.'],
  ['Apresentação', 'Formule a abertura e estabeleça o tema com clareza.'],
  ['Motivação', 'Mostre por que aquela verdade importa para a vida concreta.'],
  ['Palavra e contexto', 'Leia a Escritura no contexto literário, histórico e litúrgico.'],
  ['Conflito', 'Identifique o obstáculo espiritual que a Palavra ilumina.'],
  ['Definições e doutrina', 'Explique os conceitos com precisão e fidelidade ao Magistério.'],
  ['Aplicação', 'Leve a verdade à conversão, oração e vida cotidiana.'],
  ['Meios de santificação', 'Indique meios concretos: sacramentos, oração, virtudes e caridade.'],
  ['Conclusão', 'Retome a ideia central e conduza a uma resposta interior.']
];

const GIFTS = [
  ['Sabedoria', 'Gosto pelas coisas de Deus e julgamento sobrenatural.'],
  ['Entendimento', 'Penetração mais profunda das verdades reveladas.'],
  ['Conselho', 'Docilidade para escolher o que convém fazer diante de Deus.'],
  ['Fortaleza', 'Firmeza para vencer dificuldades e permanecer no bem.'],
  ['Ciência', 'Juízo sobrenatural sobre as criaturas em sua relação com Deus.'],
  ['Piedade', 'Amor filial a Deus e disposição para servi-Lo.'],
  ['Temor de Deus', 'Reverência filial que afasta do pecado e ordena o coração.']
];

const DEFAULT = {
  tema: '', objetivo: '', oracao: '', apresentacao: '', motivacao: '',
  palavra: '', conflito: '', doutrina: '', aplicacao: '', meios: '', conclusao: '',
  citacoes: '', notas: ''
};

export default function App() {
  const [active, setActive] = useState('roteiro');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [pulpit, setPulpit] = useState(false);
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pregacao-roteiro')) || DEFAULT; }
    catch { return DEFAULT; }
  });
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');

  const update = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    localStorage.setItem('pregacao-roteiro', JSON.stringify(next));
  };

  const stepKeys = ['objetivo','oracao','apresentacao','motivacao','palavra','conflito','doutrina','aplicacao','meios','conclusao'];
  const progress = Math.round((stepKeys.filter(k => data[k]?.trim()).length / 10) * 100);

  const filteredGifts = useMemo(
    () => GIFTS.filter(([name, desc]) => `${name} ${desc}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const print = () => window.print();

  if (pulpit) return <Pulpit data={data} onExit={() => setPulpit(false)} />;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-950 text-white shadow-lg no-print">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-lg p-2 md:hidden"><Menu size={22}/></button>
          <button onClick={() => setActive('roteiro')} className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-amber-500/60 bg-amber-500/10 text-amber-400"><Cross size={19}/></span>
            <span className="text-left"><span className="block text-sm font-bold tracking-[.18em]">PREGAÇÃO</span><span className="hidden text-[10px] text-slate-400 sm:block">ASSISTENTE DE ROTEIROS CATÓLICOS</span></span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            <Nav label="Roteiro" icon={<ScrollText size={16}/>} active={active==='roteiro'} onClick={()=>setActive('roteiro')}/>
            <Nav label="Oratório" icon={<Heart size={16}/>} active={active==='oratorio'} onClick={()=>setActive('oratorio')}/>
            <Nav label="Sete Dons" icon={<Sparkles size={16}/>} active={active==='dons'} onClick={()=>setActive('dons')}/>
          </nav>
          <button onClick={()=>setPulpit(true)} className="flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-500"><Church size={16}/> <span className="hidden sm:inline">Modo Púlpito</span></button>
        </div>
        {mobileMenu && <div className="border-t border-slate-800 px-4 py-3 md:hidden">
          <div className="grid grid-cols-3 gap-2">
            <Nav label="Roteiro" active={active==='roteiro'} onClick={()=>{setActive('roteiro');setMobileMenu(false)}}/>
            <Nav label="Oratório" active={active==='oratorio'} onClick={()=>{setActive('oratorio');setMobileMenu(false)}}/>
            <Nav label="Sete Dons" active={active==='dons'} onClick={()=>{setActive('dons');setMobileMenu(false)}}/>
          </div>
        </div>}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {active === 'roteiro' && <Roteiro data={data} update={update} step={step} setStep={setStep} progress={progress} print={print} onPulpit={()=>setPulpit(true)}/>}
        {active === 'oratorio' && <Oratorio data={data} update={update}/>}
        {active === 'dons' && <Dons gifts={filteredGifts} search={search} setSearch={setSearch}/>}
      </main>
    </div>
  );
}

function Nav({label, icon, active, onClick}) {
  return <button onClick={onClick} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${active?'bg-white/10 text-amber-300':'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{icon}{label}</button>
}

function Roteiro({data, update, step, setStep, progress, print, onPulpit}) {
  const [showNotes, setShowNotes] = useState(false);
  const key = ['objetivo','oracao','apresentacao','motivacao','palavra','conflito','doutrina','aplicacao','meios','conclusao'][step];
  const [title, help] = STEPS[step];
  return <div>
    <section className="mb-6 rounded-2xl bg-slate-950 p-5 text-white shadow-xl sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 text-[10px] font-bold tracking-[.25em] text-amber-400">WORKSPACE DE PREPARAÇÃO</div>
          <input value={data.tema} onChange={e=>update('tema',e.target.value)} placeholder="Título / tema da pregação" className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-slate-600 sm:text-3xl"/>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Fidelidade à Palavra, clareza doutrinal e aplicação para a vida interior.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={print} title="Imprimir" className="rounded-lg border border-slate-700 p-2.5 text-slate-300 hover:bg-slate-800"><Printer size={18}/></button>
          <button onClick={onPulpit} className="flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2.5 text-xs font-bold hover:bg-amber-500"><Church size={16}/> Púlpito</button>
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>Progresso</span><span>{progress}%</span></div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-amber-500 transition-all" style={{width:`${progress}%`}}/></div>
      </div>
    </section>

    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:block no-print">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">10 etapas</div>
        {STEPS.map(([name],i)=><button key={name} onClick={()=>setStep(i)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${i===step?'bg-amber-50 text-amber-800':'text-slate-600 hover:bg-slate-50'}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${data[stepKeys[i]]?.trim()?'bg-emerald-100 text-emerald-700':i===step?'bg-amber-600 text-white':'bg-slate-100 text-slate-400'}`}>{data[stepKeys[i]]?.trim()?'✓':i+1}</span>{name}</button>)}
      </aside>

      <section className="min-w-0">
        <div className="mb-3 flex items-center justify-between lg:hidden no-print">
          <button disabled={step===0} onClick={()=>setStep(step-1)} className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-30"><ChevronLeft size={18}/></button>
          <span className="text-xs font-bold text-slate-500">ETAPA {step+1} DE 10</span>
          <button disabled={step===9} onClick={()=>setStep(step+1)} className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-30"><ChevronRight size={18}/></button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-amber-700"><Lightbulb size={18}/><span className="text-[10px] font-bold uppercase tracking-[.2em]">Etapa {step+1}</span></div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">{help}</p>
          </div>
          <textarea value={data[key]} onChange={e=>update(key,e.target.value)} autoFocus={false} placeholder={placeholderFor(key)} className="min-h-[320px] w-full resize-y rounded-xl border border-slate-200 bg-[#fcfbf9] p-4 text-[15px] leading-7 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-50"/>
          <div className="mt-5 flex flex-wrap justify-between gap-2 no-print">
            <button disabled={step===0} onClick={()=>setStep(step-1)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold disabled:opacity-30"><ChevronLeft size={16}/> Anterior</button>
            {step<9 ? <button onClick={()=>setStep(step+1)} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white">Próxima etapa <ChevronRight size={16}/></button> : <button onClick={onPulpit} className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-bold text-white"><Church size={16}/> Preparar para o púlpito</button>}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 no-print">
          <button onClick={()=>setShowNotes(!showNotes)} className="flex w-full items-center gap-2 text-left text-xs font-bold text-amber-900"><FileText size={16}/> Notas e referências {showNotes?'−':'+'}</button>
          {showNotes && <textarea value={data.notas} onChange={e=>update('notas',e.target.value)} placeholder="Santos, documentos do Magistério, referências bibliográficas, exemplos..." className="mt-3 min-h-28 w-full rounded-lg border border-amber-100 bg-white p-3 text-sm outline-none"/>}
        </div>
      </section>
    </div>
  </div>
}

const stepKeys = ['objetivo','oracao','apresentacao','motivacao','palavra','conflito','doutrina','aplicacao','meios','conclusao'];
function placeholderFor(key) {
  return {
    objetivo:'Qual é a verdade principal? O que você quer que a pessoa compreenda, creia ou faça?',
    oracao:'Escreva a intenção de oração e peça luz ao Espírito Santo. O que você deseja pedir por você e pelos ouvintes?',
    apresentacao:'Como você abrirá a pregação? Uma pergunta, fato, imagem, passagem bíblica ou situação concreta?',
    motivacao:'Por que o ouvinte deveria prestar atenção? Que necessidade humana ou espiritual este tema toca?',
    palavra:'Texto bíblico, contexto, palavras-chave, personagens, relação com a liturgia e pontos que devem ser proclamados.',
    conflito:'Qual ferida, pecado, dúvida, resistência ou falsa ideia será confrontada pela Palavra?',
    doutrina:'Definições, Catecismo, Escritura, Tradição, Magistério e distinções necessárias. Evite ambiguidades.',
    aplicacao:'O que deve mudar concretamente? Dê ações possíveis e específicas para a vida cotidiana.',
    meios:'Quais meios de santificação serão propostos? Oração, sacramentos, virtudes, exame de consciência, caridade...',
    conclusao:'Retome a ideia central. Faça um apelo à conversão, à confiança em Deus e à resposta concreta.'
  }[key];
}

function Oratorio({data, update}) {
  const blocks = [
    ['Antes de falar', 'Recolha-se. Lembre-se de que você não é o centro: a Palavra e Cristo o são.'],
    ['Durante a preparação', 'Peça humildemente a luz para compreender, ordenar e comunicar aquilo que é necessário.'],
    ['Antes de subir', 'Faça um breve ato de fé, esperança e caridade. Entregue a Deus sua inteligência, voz e presença.'],
    ['No momento da pregação', 'Procure falar com verdade, caridade e sobriedade. Não procure impressionar: procure servir.'],
    ['Depois', 'Entregue os frutos a Deus e faça uma breve revisão: o que foi fiel, claro e caridoso?']
  ];
  return <div className="mx-auto max-w-4xl">
    <div className="mb-6 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
      <div className="mb-2 flex items-center gap-2 text-amber-400"><Heart size={18}/><span className="text-[10px] font-bold tracking-[.2em]">ORATÓRIO DO PREGADOR</span></div>
      <h1 className="font-serif text-3xl font-bold">A pregação começa antes da palavra.</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Um pequeno exame interior para manter a preparação subordinada à oração, à verdade e à caridade pastoral.</p>
    </div>
    <div className="space-y-3">{blocks.map(([title,text],i)=><div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">{i+1}</span><div><h2 className="font-serif text-lg font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div></div>)}</div>
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-serif text-lg font-bold"><ClipboardCheck size={18}/> Exame pessoal</h2><textarea value={data.notas} onChange={e=>update('notas',e.target.value)} placeholder="Que atitude interior preciso cultivar para esta pregação?" className="mt-3 min-h-36 w-full rounded-xl bg-[#fcfbf9] p-4 text-sm leading-6 outline-none"/></div>
  </div>
}

function Dons({gifts, search, setSearch}) {
  return <div className="mx-auto max-w-5xl">
    <div className="mb-6 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
      <div className="mb-2 flex items-center gap-2 text-amber-400"><Sparkles size={18}/><span className="text-[10px] font-bold tracking-[.2em]">TRATADO DOS SETE DONS</span></div>
      <h1 className="font-serif text-3xl font-bold">Os dons do Espírito Santo</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">Resumo de apoio para estudo e preparação de pregações sobre a vida sobrenatural.</p>
      <div className="relative mt-5 max-w-xl"><Search className="absolute left-3 top-3 text-slate-500" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar um dom..." className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500"/></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">{gifts.map(([name,desc],i)=><article key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-50 font-serif font-bold text-amber-700">{i+1}</span><h2 className="font-serif text-xl font-bold">{name}</h2></div><p className="text-sm leading-6 text-slate-500">{desc}</p></article>)}</div>
    <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Para a pregação:</strong> os dons não substituem a vida ascética; aperfeiçoam a docilidade da alma à ação do Espírito Santo e devem ser apresentados em harmonia com a doutrina católica.</div>
  </div>
}

function Pulpit({data,onExit}) {
  const sections = STEPS.map(([title],i)=>({title,text:data[stepKeys[i]]})).filter(x=>x.text?.trim());
  const [idx,setIdx] = useState(0);
  return <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
      <div className="flex items-center gap-3"><Cross className="text-amber-500" size={20}/><div><div className="text-xs font-bold tracking-[.2em]">MODO PÚLPITO</div><div className="text-[10px] text-slate-500">{data.tema || 'Sem título'}</div></div></div>
      <button onClick={onExit} className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800"><X size={19}/></button>
    </header>
    <main className="flex flex-1 items-center justify-center overflow-auto p-6 sm:p-12">
      {sections.length ? <article className="w-full max-w-4xl"><div className="mb-6 text-xs font-bold uppercase tracking-[.25em] text-amber-500">{sections[idx].title} · {idx+1}/{sections.length}</div><div className="whitespace-pre-wrap font-serif text-2xl leading-[1.65] text-slate-100 sm:text-4xl">{sections[idx].text}</div></article> : <div className="text-center text-slate-500">Preencha o roteiro para utilizar o Modo Púlpito.</div>}
    </main>
    {sections.length>0 && <footer className="flex justify-center gap-3 border-t border-slate-800 p-4"><button disabled={idx===0} onClick={()=>setIdx(idx-1)} className="rounded-xl border border-slate-700 px-5 py-3 disabled:opacity-30"><ChevronLeft/></button><button disabled={idx===sections.length-1} onClick={()=>setIdx(idx+1)} className="rounded-xl bg-amber-600 px-5 py-3 disabled:opacity-30"><ChevronRight/></button></footer>}
  </div>
}
