---
title: The Sprague-Grundy theorem
tags:
  - games
description: How can we define a group on the set of impartial games?
---
## Preliminaries

First, you may want to read a short introduction to the problem space such as [this one](https://cp-algorithms.com/game_theory/sprague-grundy-nim.html#introduction).

Traditionally, the Nim game is introduced *prior* to deriving the Sprague-Grundy theorem. In this post, we will instead show how Nim naturally arises from a **greedy algorithm** to categorize games. Specifically, we will first motivate the usage of XOR, then the usage of MEX.

Theoretically, to solve any impartial game, we need only to determine a single bit of information about every possible position: whether the next player (about to make a move) wins, or loses. If the next player wins, the state is called an *N-position*; otherwise, if the previous player wins, the state is a *P-position*. Together, N-positions and P-positions comprise the two possible **outcome classes** of any impartial game.

![[Pasted image 20251104184810.png]]

*An example of a simple game with positions labeled N or P. Recall that all impartial games can be represented as DAGs (directed acyclic graphs).*

The positions are labelled according to the following rules:
1. All terminal states (i.e. states with no out-degree) are P-positions.
2. If a state has an edge to any P-position, it is an N-position.
3. Otherwise, it is a P-position.

## Sums of games

We define the sum of two games $G + H$ as a new game in which the games $G$ and $H$ are played in parallel: on each player's turn, they can choose to move in *exactly one* of the two games, and leave the other unchanged (a classic example of this would be a two-pile Nim game).

> [!Note]
> Considering the positions as DAGs, this $+$ operation corresponds precisely to a Cartesian product:
![[Pasted image 20251104184829.png]]
> *A simple Cartesian product, illustrated. Each edge corresponds to a move on exactly one of the two parallel positions.*
> Note that the $+$ operation as defined here is both commutative and associative. It is also closed over the space of impartial games, since the Cartesian product of two DAGs is still a DAG.

Importantly, under our current definition of equivalence by outcome classes (i.e. all N-positions are equivalent, as are all P-positions), equivalent positions **might not** produce equivalent results when combined with other positions. Specifically, two N-positions combined could produce either an N-position or a P-position.

![[Pasted image 20251104184848.png]]

*Two N-positions combined don't always yield equivalent results.*

This motivates a new definition of equivalence:

>[!tip] Definition: position equivalence
>$G equiv H$ iff for all positions $X$, $X + G$ and $X + H$ belong to the same outcome class.
>

To assist with the following inductive proofs, we introduce the notion of the **size** of a position $|G|$ as the total number of reachable positions from $G$ after one more more moves. Importantly, this means that if position $G$ can move to position $H$, $|H| < |G|$. 

We will also refer to the previous player and next player as Players P and N, respectively.

We can now prove our first theorem:
> [!note] Theorem: P-positions
> For any P-position $G$, $G equiv emptyset$ ($emptyset$ denotes the empty game, which is also a P-position).

*Proof.* By definition, we must show that for all $X$, $X + G$ and $X$ have the same winner. We split this into two cases:
1. $X$ is a P-position, so we want to show $X + G$ is also a P-position. 
	- If player N moves $X -> X'$, player P must be able to make the move $X' -> X''$ where $X''$ is a P-position. By induction on $|X|$, $X'' + G$ is also a P-position. 
	- Symmetric reasoning for if player N moves $G -> G'$ instead. 
	- Therefore, no matter how player N moves in $X + G$, player P can always return it to a P-position.
2. $X$ is an N-position, so we want to show that $X + G$ is also an N-position.
	- If $X$ is an N-position, there must exists a move $X -> X'$ such that $X'$ is a P-position. From the first case, $X' + G$ is also a P-position, therefore in both games player N can move to a P-position, as desired.

Importantly, this means that *all P-positions are still equivalent to one another.*

---
> [!info] Corollary
> For all games $G$, $G + G equiv emptyset$. 

*Proof.* We just need to show $G + G$ is a P-position, which is true because player P can always just mirror the moves of player N.

---
Now that we've now discovered the inverse of $G$ (specifically, $-G = G$), note that our notions of equivalence and sum define a **group**:
1. The operation $+$ is both associative and commutative.
2. The identity element is $emptyset$. 
3. The inverse of an element $G$ is $G$ itself.

> [!info] Corollary
> $G equiv H$ iff $G + H$ is a P-position, i.e. $G + H equiv emptyset$.

*Proof.* By elementary group properties.
## XOR?

The fundamental reason that XOR shows up is the fact that $G + G = emptyset$. In particular, consider a set of positions ${g_i}$ and the following two sums:
- $G = g_1 + g_2 + g_4$;  we encode this as $f(G) = 1101$. 
- $H = g_2 + g_3$; we encode this as $f(H) = 0110$.

Then we have that $G + H = g_1 + g_3 + g_4 => f(G + H) = 1011 = f(G) xor f(H)$.

Note that this XOR property holds for *any choice* of ${g_i}$. However, we'd also like an additional condition:
> Any non-empty sum of *distinct* elements of ${g_i}$ should not be equivalent to $emptyset$. 

or, alternatively:
> Every position $G$ should have a unique representation as a sum of *distinct* ${g_i}$. 

In linear algebra terms, we want ${g_i}$ to be an **independent basis** of all possible positions. If this holds, then we have the nice property that $G equiv emptyset$ iff $f(G) = 0$.

Therefore, it remains to solve the following question: how do we actually find such a basis?

## MEX!

Let me first describe a simple algorithm to find a basis:
1. Topologically sort all game states.
2. Initialize our basis $g$ as an empty *list*, $[]$ (because order matters!).
3. In reverse topological order, check if our current game $G$ is independent of $g$. If yes, append $G$ to the end of $g$.

And that's it!

Wait, what? That's it? How is this even remotely related to MEX? And how do we check whether a game is independent of $G$? The key idea is to show that because of this specific greedy approach, the $i$th basis element $g_i$ has the property that it can transition to an equivalent state of **every** subset of the first $i$ basis elements. That is, for every $z < 2^i$, $g_i$ can transition to a state $Z$ such that $f(Z) = z$. This will enable us to implement a much faster check for independence.

In fact, together with the properties of XOR, this claim generalizes to the following:

>[!info] Theorem
> For every state $Y$ and every $z < f(Y)$, $Y$ can transition to some state $Z$ such that $f(Z) = z$.

Do you see where mex could come in now?

**Proof:**
We induct. Let's say this claim is true for every state we've encountered so far. Now, let our current state be $G$, and the set of possible next states as $T_i$. Let $m$ be the MEX of $f(T_i)$ over all $T_i$. We wish to show that $f(G) = m$.

To do this, consider some game $M$ in equivalence class $m$ and spanned by our current basis $X$. If no such game exists, $G$ is independent of $X$ and thus will be added as a new element to the basis. Note that this also means we can transition to every game currently spanned by $X$, so our inductive hypothesis still holds.

Otherwise, we then need to prove is that $G equiv M => G + M equiv emptyset$. We can show this by splitting into two cases:
1. The first player moves either $G$ or $M$ to a state $Z$ with $f_X(Z) < m$. The second player can then match this value by moving on the other game. Both states will have value $f_X(Z)$ and will thus form a P-position.
2. The first player moves either $G$ or $M$ to a state $Z$ with $f_X(Z) > m$. The second player can then move this state back to one with value $m$. Both games will now have value $m$ and will thus form a P-position.

Since the second player can always force the first player to begin their next turn on a P-position, it follows that $G + M$ must be a P-position itself. Therefore, $G equiv M$, as desired.

---
OK, that was a lot. But the primary takeaway is that the **entire reason** mex is used is because of the (surprisingly elegant) *greedy strategy* we used in order to find a valid basis. In fact, (don't quote me on this) this may be one of the *only* efficient strategies to compute a valid basis because of the issue of checking independence. If $X$ was just some arbitrary basis, this could have taken forever to check, and maybe even have been impossible. Thankfully, due to the nice structure our greedy algorithm imposes on $X$, we instead end up with a very quick and elegant way of evaluating independence.

The best part? We derived all these beautiful results without referencing the game of Nim at all! The XOR relation arose naturally from the "mirror" nature of combining identical impartial games, and *mex* showed up as a direct result of the simple greedy strategy we defined to find a valid basis. This, I believe, is truly the best way to understand the *fundamental nature* of the Sprague-Grundy theorem.
