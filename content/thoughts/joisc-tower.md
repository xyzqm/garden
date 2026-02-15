---
title: "JOISC: Tower"
tags:
  - math
---
You can find the problem statement [here](https://qoj.ac/problem/8648).

Let $f_x$ denote the maximum number of jumps on any path to $x$. We wish to show that if $y in [x, x + D]$, $f_y <= f_x + 1$. As a consequence, every block of $D$ values will only take on two distinct values, which greatly reduces the complexity of our problem.

---

**Proof:** We will do a proof by contradiction. Assume $f_y > f_x + 1$. Let $X$ be a trajectory to $x$ that takes $f_x$ jumps, and $Y$ be a trajectory to $y$ that takes $f_y$ jumps. Also, let $g_X$ and $g_Y$ denote the number of single-steps taken by $X$ and $Y$ respectively. Then, note that our above inequality is equivalent to $g_X >= g_Y + D$. We now wish to show that given this condition, there must exist an intersection between $X$ and $Y$ such that prior to that intersection, $Y$ uses one more jump than $X$.

![[Pasted image 20260214194204.png|500]]

*An example of one such intersection is shown by the red line.*

If such an intersection exists, we can swap the section of $Y$ before the intersection with the section of $X$, thereby increasing $f_X$ by 1 and contradicting our assumption.

Consider the following algorithm to find such an intersection:
```
step_balance = 0
balance = 0
start trajectories X and Y at 0
while step_balance <= D:
	if Y_pos <= X_pos:
		advance Y
		^ if single step, --step_balance, --balance
		^ else, balance -= D
	else:
		advance X
		^ if single step, ++step_balance, ++balance
		^ else, balance += D
```

I claim that this algorithm will always terminate with $X$ and $Y$ at the same position---that is, `balance` will equal $0$.

First, note that the program will definitely terminate and always with `step_balance = D`.

Furthermore, note that `step_balance` and `balance` are always congruent modulo $D$.

Finally, note the following two properties of the above algorithm:
- If $X$ was the last trajectory advanced, `balance > -D`.
- If the last step $X$ took was a single step, `balance <= 0`.

Therefore, if `step_balance = D`, the only viable  value of `balance` is 0.

---