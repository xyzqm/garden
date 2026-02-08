---
title: Password
tags:
  - math
---
You are given two binary strings. Find all pairs of strings $(a, b)$ such that when all $0$s are replaced by $a$ and all $1$s are replaced by $b$, the two binary strings are transformed to the same final string.

For instance, if the two binary strings are $011$ and $1000$, $("ab", "abab")$ is a valid pair.

If both binary strings begin with the same symbol, we can simply delete them and consider the remaining suffixes. We consider two cases:
1. Both strings are now empty. In this case, all pairs of $(a, b)$ are valid.
2. Otherwise, the starting symbols of the two strings are distinct.

In case 2, this means that $a$ is either a prefix or suffix of $b$. WLOG, assume $a$ is a prefix of $b$ and let $u <= v$ be the lengths of $a$ and $b$ respectively.
- If $u = v$, then evidently $a = b$. 
- Otherwise, we can express $b$ as $a + b'$ for some non-empty string $b'$. Substitute all $1$s with $01$, and our problem reduces from $(u, v)$ to $(u, v - u)$.

Note that in the second case, $(u, v)$ strictly decreases so we will hit the $u = v$ case eventually. Working backwards, this means that both $a$ and $b$ must be periodic in $gcd(u, v)$. 

Intuitively, the "interlocking pattern" created when $u != v$ is very reminiscent of the Euclidean algorithm, which naturally leads to the periodic constraint derived above.

![[Pasted image 20260208113343.png|600]]
