# AI Usage

## How AI Was Used in Cipher DesignLab

AI tools were used throughout the development of Cipher DesignLab as an engineering assistant.

They helped with:

- brainstorming possible approaches;
- comparing architecture choices;
- reviewing Low-Level Design decisions;
- debugging implementation problems;
- identifying edge cases;
- improving prompts and evaluation logic;
- accelerating repetitive development work.

However, AI suggestions were **not treated as automatically correct**.

Every important suggestion was reviewed against:

1. the requirements of the assignment;
2. the actual needs of the learner;
3. simplicity and maintainability;
4. reliability and testability;
5. the limited scope of the prototype.

In several cases, an AI suggestion was accepted. In others, it was modified or rejected completely.

The following five examples show some of the most meaningful AI-assisted engineering decisions made during the project.

---

# 1. Separating Objective Checks from AI Judgement

## The problem

Cipher DesignLab needs to evaluate a learner's Low-Level Design.

At first, it might seem easiest to send the entire design to an AI model and ask:

> "Is this a good design?"

The problem is that not every part of a design should be judged in the same way.

Some mistakes are objective.

For example:

- a relationship refers to a class that does not exist;
- the same class is declared multiple times;
- important structural information is missing.

These are facts that normal program logic can verify.

Other questions require judgement.

For example:

- Does each class have a clear responsibility?
- Is the design too tightly coupled?
- Is an abstraction actually useful?
- Would the design handle future changes well?
- Are the learner's trade-offs reasonable?

These questions do not always have one mathematically correct answer.

## AI suggestion

AI suggested separating these two kinds of evaluation instead of forcing one evaluator to handle everything.

The proposed architecture introduced a common `Evaluator` abstraction with different evaluator implementations.

## Our decision

**Accepted.**

The final system contains:

- `RuleBasedEvaluator`
- `OpenRouterLlmEvaluator`
- `CompositeEvaluator`

## What this means in simple terms

Think of the system as having **two reviewers**.

The first reviewer is strict and mechanical.

It checks things that can be proven directly from the submission.

The second reviewer behaves more like an experienced software-design mentor.

It evaluates areas where context and reasoning matter.

The `CompositeEvaluator` combines both perspectives into one evaluation result.

## Why we accepted it

This separation makes the system more trustworthy.

We do not need an AI model to determine whether a referenced class actually exists. Normal code can answer that more reliably.

At the same time, normal `if/else` rules are not enough to decide whether a learner has chosen a sensible abstraction or explained a trade-off well.

Using both approaches allows each tool to do the job it is best suited for.

It also improves maintainability and testing because the rule-based and AI-based evaluation logic can evolve independently.

---

# 2. Rejecting a Single AI-Generated Score

## The problem

One early approach was very simple:

1. send the learner's entire design to an LLM;
2. ask it to evaluate the design;
3. ask it to return a score from 0 to 100.

For example:

```text
Overall design score: 82/100