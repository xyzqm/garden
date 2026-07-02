---
title: Models of computation
draft: false
---
The content of this page is currently very barebones and just meant to be enough to understand [[p vs np]]. More may be added in the future.

## What is a computer?

I built a machine that computes 123 + 456! Is this a computer?

Not quite, as computers must operate on some kind of input—if your machine instead took in two arbitrary three digit numbers and added them together, that would qualify as a computer. Indeed, the ability to solve a problem on different inputs is precisely what makes a computer interesting. We will now study two models for interacting with these inputs: finite-state machines and Turing machines.

## Finite-state machines

As the name would suggest, a finite-state machine (FSM) is a machine that operates under a finite amount of states. 

> [!note] 
Every physical computer actually qualifies as an FSM because it has a finite amount of memory and therefore can only be in a finite amount of states; more precisely, if a computer has $x$ bits of memory, it can be in at most $2^x$ distinct states.

In addition to these states, an FSM also has a transition table that tells it how to change states according to input. For instance, we can construct the following FSM to decide whether a given binary string has an even number of 0s:

<div class="fsm-even0s">
<style>
/* Define scoped vars with Quartz-first, hardcoded fallback.
   Quartz defines these on :root so they win via inheritance;
   in Obsidian (where they're absent) the fallback kicks in. */
.fsm-even0s{
  --fsm-stroke:var(--darkgray,#4e4e4e);
  --fsm-muted:var(--gray,#b8b8b8);
  --fsm-accent:var(--secondary,#284b63);
  --fsm-hl:var(--highlight,rgba(143,159,169,.15));
  --fsm-text:var(--dark,#2b2b2b);
  --fsm-bg:var(--light,#faf8f8);
  --fsm-border:var(--lightgray,#e5e5e5);
  border:1px solid var(--fsm-border);border-radius:8px;padding:1rem 1.5rem 1.5rem;margin:1.5rem 0
}
@media(prefers-color-scheme:dark){.fsm-even0s{
  --fsm-stroke:var(--darkgray,#d4d4d4);
  --fsm-muted:var(--gray,#646464);
  --fsm-accent:var(--secondary,#7b97aa);
  --fsm-text:var(--dark,#ebebec);
  --fsm-bg:var(--light,#161618);
  --fsm-border:var(--lightgray,#393639)
}}
.fsm-even0s svg{display:block;margin:0 auto;width:100%;max-width:500px;overflow:visible}
.fsm-even0s .fsm-controls{display:flex;align-items:center;gap:.5rem;margin-top:1rem;flex-wrap:wrap}
.fsm-even0s .fsm-lbl{font-size:.9rem;color:var(--fsm-stroke)}
.fsm-even0s .fsm-inp{font-family:var(--codeFont,monospace);font-size:1rem;border:1px solid var(--fsm-border);border-radius:4px;padding:.3rem .6rem;background:var(--fsm-bg);color:var(--fsm-text);flex:1;min-width:90px;max-width:210px}
.fsm-even0s .fsm-inp:focus{outline:2px solid var(--fsm-accent);border-color:transparent}
.fsm-even0s .fsm-err{font-size:.85rem;color:#dc3545;margin-top:.4rem;display:none}
.fsm-even0s .fsm-trace{margin-top:1rem;display:none;overflow-x:auto}
.fsm-even0s .fsm-trace-seq{display:flex;align-items:center;padding:.25rem 0;min-width:max-content;gap:0}
.fsm-even0s .fsm-pill{display:inline-flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:50%;border:2px solid var(--fsm-muted);font-size:.75rem;font-weight:600;color:var(--fsm-text);background:var(--fsm-bg);flex-shrink:0}
.fsm-even0s .fsm-pill.acc{box-shadow:0 0 0 3px var(--fsm-accent);border-color:var(--fsm-accent)}
.fsm-even0s .fsm-pill.cur{background:var(--fsm-accent);color:var(--fsm-bg);border-color:var(--fsm-accent)}
.fsm-even0s .fsm-arrow{display:flex;flex-direction:column;align-items:center;margin:0 3px;flex-shrink:0}
.fsm-even0s .fsm-arrow .bit{font-family:var(--codeFont,monospace);background:var(--fsm-border);padding:1px 5px;border-radius:3px;font-size:.8rem;color:var(--fsm-stroke);margin-bottom:1px}
.fsm-even0s .fsm-arrow .arr{color:var(--fsm-muted);font-size:1.1rem;line-height:1}
.fsm-even0s .fsm-res{margin-left:10px;padding:.3rem .75rem;border-radius:4px;font-weight:700;font-size:.9rem;flex-shrink:0}
.fsm-even0s .fsm-res.acc{color:#198754;background:rgba(25,135,84,.1);border:1px solid rgba(25,135,84,.3)}
.fsm-even0s .fsm-res.rej{color:#dc3545;background:rgba(220,53,69,.1);border:1px solid rgba(220,53,69,.3)}
@media(prefers-color-scheme:dark){.fsm-even0s .fsm-res.acc{color:#6ee7b7}.fsm-even0s .fsm-res.rej{color:#fca5a5}}
</style>

<svg viewBox="0 0 500 210" xmlns="http://www.w3.org/2000/svg" aria-label="FSM with two states: even (accepting) and odd, connected by 0-transitions and self-loops on 1">
  <defs>
    <marker id="fsm-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="var(--fsm-stroke)"/>
    </marker>
  </defs>

  <!-- start arrow -->
  <line x1="28" y1="110" x2="103" y2="110" stroke="var(--fsm-stroke)" stroke-width="1.5" marker-end="url(#fsm-arr)"/>
  <text x="28" y="103" text-anchor="middle" font-size="11" fill="var(--fsm-muted)" font-family="inherit">start</text>

  <!-- even→odd (0): top arc -->
  <path d="M 166,84 Q 250,34 334,84" fill="none" stroke="var(--fsm-stroke)" stroke-width="1.5" marker-end="url(#fsm-arr)"/>
  <text x="250" y="27" text-anchor="middle" font-size="13" fill="var(--fsm-stroke)" font-family="inherit">0</text>

  <!-- odd→even (0): bottom arc -->
  <path d="M 334,136 Q 250,186 166,136" fill="none" stroke="var(--fsm-stroke)" stroke-width="1.5" marker-end="url(#fsm-arr)"/>
  <text x="250" y="200" text-anchor="middle" font-size="13" fill="var(--fsm-stroke)" font-family="inherit">0</text>

  <!-- even self-loop (1) -->
  <path d="M 122,79 C 78,18 202,18 158,79" fill="none" stroke="var(--fsm-stroke)" stroke-width="1.5" marker-end="url(#fsm-arr)"/>
  <text x="140" y="13" text-anchor="middle" font-size="13" fill="var(--fsm-stroke)" font-family="inherit">1</text>

  <!-- odd self-loop (1) -->
  <path d="M 378,79 C 422,18 298,18 342,79" fill="none" stroke="var(--fsm-stroke)" stroke-width="1.5" marker-end="url(#fsm-arr)"/>
  <text x="360" y="13" text-anchor="middle" font-size="13" fill="var(--fsm-stroke)" font-family="inherit">1</text>

  <!-- even: accepting state (double circle) -->
  <circle cx="140" cy="110" r="44" fill="none" stroke="var(--fsm-accent)" stroke-width="1.5"/>
  <circle class="fsm-node even-node" cx="140" cy="110" r="36" fill="var(--fsm-hl)" stroke="var(--fsm-accent)" stroke-width="2"/>
  <text class="fsm-node-lbl even-lbl" x="140" y="107" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" fill="var(--fsm-text)" font-family="inherit">even</text>
  <text x="140" y="123" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--fsm-muted)" font-family="inherit">q₀</text>

  <!-- odd state -->
  <circle class="fsm-node odd-node" cx="360" cy="110" r="36" fill="var(--fsm-hl)" stroke="var(--fsm-stroke)" stroke-width="2"/>
  <text class="fsm-node-lbl odd-lbl" x="360" y="107" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" fill="var(--fsm-text)" font-family="inherit">odd</text>
  <text x="360" y="123" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--fsm-muted)" font-family="inherit">q₁</text>
</svg>

<div class="fsm-controls">
  <span class="fsm-lbl">Binary string:</span>
  <input class="fsm-inp" type="text" placeholder="e.g. 010110" maxlength="64" autocomplete="off" spellcheck="false" inputmode="numeric"/>
</div>
<div class="fsm-trace"><div class="fsm-trace-seq"></div></div>

<script>
(function(){
  var root=document.currentScript.closest('.fsm-even0s');
  var inp=root.querySelector('.fsm-inp');
  var traceEl=root.querySelector('.fsm-trace');
  var seq=root.querySelector('.fsm-trace-seq');
  var nodeEven=root.querySelector('.even-node');
  var nodeOdd=root.querySelector('.odd-node');
  var lblEven=root.querySelector('.even-lbl');
  var lblOdd=root.querySelector('.odd-lbl');

  function update(){
    var val=inp.value;
    if(val.length===0){traceEl.style.display='none';highlight(-1);return;}
    // state 0=even (accepting), 1=odd
    var state=0,steps=[{state:0,bit:null}];
    for(var i=0;i<val.length;i++){
      state=val[i]==='0'?1-state:state;
      steps.push({state:state,bit:val[i]});
    }
    seq.innerHTML='';
    for(var j=0;j<steps.length;j++){
      var s=steps[j];
      if(s.bit!==null){
        var a=document.createElement('div');
        a.className='fsm-arrow';
        a.innerHTML='<span class="bit">'+s.bit+'</span><span class="arr">→</span>';
        seq.appendChild(a);
      }
      var p=document.createElement('div');
      p.className='fsm-pill'+(s.state===0?' acc':'')+(j===steps.length-1?' cur':'');
      p.textContent=s.state===0?'even':'odd';
      seq.appendChild(p);
    }
    var final=steps[steps.length-1].state;
    var r=document.createElement('div');
    r.className='fsm-res '+(final===0?'acc':'rej');
    r.textContent=final===0?'✓ ACCEPT':'✗ REJECT';
    seq.appendChild(r);
    traceEl.style.display='block';
    highlight(final);
  }

  function highlight(s){
    nodeEven.style.fill='var(--fsm-hl)';
    nodeOdd.style.fill='var(--fsm-hl)';
    lblEven.style.fill='var(--fsm-text)';
    lblOdd.style.fill='var(--fsm-text)';
    if(s===0){nodeEven.style.fill='var(--fsm-accent)';lblEven.style.fill='var(--fsm-bg)';}
    else if(s===1){nodeOdd.style.fill='var(--fsm-accent)';lblOdd.style.fill='var(--fsm-bg)';}
  }

  // Block any character that isn't 0 or 1, including paste
  inp.addEventListener('keydown',function(e){
    if(e.key.length===1&&e.key!=='0'&&e.key!=='1')e.preventDefault();
  });
  inp.addEventListener('input',function(){
    // Strip any non-01 chars that sneak in (e.g. mobile autocorrect or paste)
    var clean=inp.value.replace(/[^01]/g,'');
    if(clean!==inp.value){var pos=inp.selectionStart-(inp.value.length-clean.length);inp.value=clean;inp.setSelectionRange(pos,pos);}
    update();
  });
})();
</script>
</div>

> [!note] Regular expressions
> By [Kleene's theorem](https://en.wikipedia.org/wiki/Kleene%27s_algorithm), FSMs are actually equivalent to regular expressions. However, it's worth noting that modern regex engines are actually **not** regular expressions because they support non-regular features like backreferences and recursion.

However, a problem that an FSM would *not* be able to solve is determining whether an arbitrary-length binary string is a palindrome, since this task would require an unbounded amount of memory to store the first half of the string, in order to later compare it against the second. In order to tackle such tasks, we need to introduce a more powerful model of computation.

## Turing machines

Turing machines are FSMs with one important added feature: read/write access to an infinite tape of external memory. Thus, when transitioning to the next state, they can perform two additional actions: write a symbol to the location currently underneath the tape head, and/or move the tape head left or right.

### Non-deterministic Turing machines

Unlike deterministic Turing machines (DTMs), non-deterministic Turing machines (NDTMs) can be in multiple states at once; that is, each state can specify a *set* of actions (next state, write, move tape) to perform per transition rather than just a single one. The following image from Wikipedia best illustrates the difference:
![invert|500](https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Difference_between_deterministic_and_Nondeterministic.svg/960px-Difference_between_deterministic_and_Nondeterministic.svg.png)