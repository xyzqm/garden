---
title: Groups
---
There are two primary ways to think about groups, either as a generalization of "combination"-style operations (e.g. addition or multiplication, which combine two numbers to form another number), or in terms of symmetries. I will briefly describe both of these approaches below.

## Combinations

A group $G$ must have a combination operation $dot$ that satisfies the following properties:
1. *Closure:* for two elements $a, b in G$, $a dot b$ is also in $G$.
2. *Associativity:* for $a, b, c in G$, $(a dot b) dot c =  a dot (b dot c)$. 
3. *Identity element*: there exists $e in G$ such that $forall g in G, e dot g = g dot e = g$.
4. *Inverse element*: for all $g in G$, there exists an element $g^(-1) in G$ such that $g^(-1) dot g = g dot g^(-1) = e$. 

Some basic examples of groups:
- The set of integers $ZZ$ equipped with the operation $+$ (addition). The identity element is $0$, and the inverse of $x$ is $-x$.
- The set of integers under mod $n$ ($ZZ_n$) equipped with $+$.
-  $ZZ_p$ equipped with $times$, where $p$ is a prime (but NOT arbitrary $ZZ_n$ or $ZZ$, since an inverse element does not always exist). 
- The set of $n$-dimensional real vectors equipped with vector addition.
- The set of **invertible** $n times n$ real matrices equipped with matrix multiplication, also known as the *general linear group* or $"GL"(n, RR)$. 

## Symmetries

One may also think of a group in the context of an object $O$, then define a group $G$ as the set of transformations that leave $O$ unchanged.

For instance, let $O$ be an equilateral triangle. Then, the following transformations will leave $O$ unchanged:
- Rotation by 0, 120, or 240 degrees.
- Reflection across any of the triangle's three altitudes.

Before we move on, we should clarify what exactly it means for two transformations to be different. Why should we consider 0 and 360 the same but 0 and 240 different, when both leave the triangle unchanged? In other words, how can we "see" the difference?

One easy fix is to number the triangle's vertices 1, 2, 3 in clockwise order. Then, one may verify that each of the six operations listed above are distinct. One may then note that these are the *only* six distinct transformations, as there can only be at most $3!$ ways to rearrange the vertices.

Considering the same problem but on a square, these are the eight possible transformations constituting the group $D_4$:
![[Pasted image 20260705213042.png]]

*Image from [Wikipedia](https://en.wikipedia.org/wiki/Group_(mathematics)).*

Note that this is less than the $4!$ total ways of rearranging vertices arbitrarily.