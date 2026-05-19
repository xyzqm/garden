---
title: "JOISC 2019: Lamps"
---
Problem statement [here](https://qoj.ac/problem/69).

**Intuition**: Reversing a range is a rather "invertible"/information-preserving operation (as compared to the other two, which overwrite a range); therefore, it should be possible to modify the operations such that all the reversals come last while the total number of operations is preserved.

**Proof**: 
![[Pasted image 20260518180414.png|600]]

The red intervals denote reversal, while the blue intervals denote an overwrite. The initial order is reverse, then overwrite; the transformed order is overwrite, then reverse (in the top-right case, the value of the overwrite flips). In every case, we can rearrange/modify the operations such that the overwrite comes first.

---

**Intuition:** If we are only allowed to flip *disjoint* intervals, the number of required intervals is the same.

**Proof:** Perhaps the easiest way to show this is by considering the desired flip pattern, then its adjacent difference array (shown in black and red respectively):
![[Pasted image 20260518181138.png|700]]

0s are padded to the original array for convenience. Two possible sequences of reversals are also shown in green; notably, they both require two intervals.

This is because in the difference array, each reversal flips the value of *exactly two* differences. Therefore, the number of required intervals is exactly $("number of 1s in difference array")/2$, and this can be achieved easily by only using disjoint intervals. 

---

**Intuition:** The answer also doesn't change if the intervals we overwrite must be disjoint as well.

**Proof:** The only special case is when overwrite occurs entirely inside another, like `1 1 0 0 1 1`. However, we can actually remodel this as an overwrite, then a flip. In other cases, it's pretty easy to make sure the intervals are disjoint.

--- 
The good thing about the 2nd and 3rd points is that both the # of reversals required, as well as the # of overwrites, become very [[local]] properties because all intervals are disjoint. What I mean is this:
1. If we want to count the # of flips required, we can also just count the number of 1s that appear directly before 0s in the black array.
2. For a given overwrite pattern, the # of distinct intervals is equal to the number of times we switch from some overwrite to another/no overwrite.

Therefore, the transition from prefix $i$ to prefix $i + 1$ depends only on the values of `a` and `b` at those two indices, as well as whether they have been overwritten or not. So, we can compute an $N dot 3$ DP table (the three substates overwrite 0/1, no overwrite) to solve the problem in $cal(O)(n)$ time.

For more details, you can find my solution [here](https://qoj.ac/submission/2398335).