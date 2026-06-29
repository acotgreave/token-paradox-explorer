# Token Paradox Explorer

An interactive scenario explorer for the apparent contradiction at the heart of AI economics:

> *"Token costs are blowing company budgets"* — and simultaneously — *"Token cost is dropping to zero, so there's no moat"*

Both headlines are true. They just have different subjects.

## What it shows

Three small-multiple charts update in real time as you adjust two levers:

- **Price per token** — annual % decline (reflecting hardware efficiency + competition)
- **Token usage** — annual % growth (reflecting adoption, agents, copilots)

The three charts show:
1. **Token volume** — how much is being consumed
2. **Price per token** — what each token costs to produce
3. **Total spend** — volume × price, the number that actually matters to CFOs

The key insight: total spend = price × volume. Price can fall 50% per year while spend still explodes if usage grows faster. The charts make this dynamic visceral.

## Preset scenarios

| Scenario | Price/yr | Usage/yr | Outcome |
|---|---|---|---|
| 🔥 Today's reality | −50% | +200% | Bills rise |
| ⚖️ Near equilibrium | −75% | +100% | Roughly flat |
| 💸 Deflationary win | −90% | +50% | Costs collapse |
| 🤖 Agent explosion | −30% | +600% | Budgets blow |
| 🧊 Stagnation | −50% | flat | Steady savings |

## Built with

- React + Vite
- HTML Canvas (no charting library)
- No external dependencies

## Run locally

```bash
npm install
npm run dev
```

## Background

Built as a companion to [How To Speak Data](https://howtospeakdata.substack.com) — a newsletter about data storytelling, AI, and analytics.
