---
title: Mass points
---
## Definitions

We denote a massed point $A$ with mass $m_A$ as $(A, m_A)$, or just $A$ if the mass is clear. We denote the **center of mass** of two massed points $A$ and $B$ as $A + B$, and define it as
$$
A + B = ((m_A A + m_B B)/(m_A + m_B), m_A + m_B)
$$


In other words, we take the weighted average of the two points and add their masses.

> [!note] Exercise
> What is $((1, 1), 1) + ((4, 7), 2)$? 
> 
> (To reiterate, $((1, 1), 1)$ denotes a point at $(1, 1)$ with mass $1$, and $((4, 7), 2)$ denotes a point at $(4, 7)$ with mass $2$.)

> [!tip]- Solution
> The center of mass of those two points is $((3, 5), 3)$. 

> [!note] Exercise
> Show that $B = A + C$ lies on the line segment $overline(A C)$, and moreover that $A B : B C = m_C : m_A$.

^cc1f19

Both have rather boring algebraic proofs, but the intuition typically given is to consider a seesaw balanced at $B$ and recall the physical fact that $("length of lever") times ("weight on lever")$ should be balanced on both sides: that is, $m_A dot A B = B C dot m_C$. 
![[Pasted image 20260708003626.png|500]]

It should be clear that $+$ is commutative, but perhaps a little less obvious that it's associative:

> [!note] Exercise
> Show that $(A + B) + C = A + (B + C)$.

> [!info] Hint
> It may help to rewrite points in weighted-point form, where $(A, m_A)$ is instead written as $(m_A A, m_A)$. How can we find $A + B$ when all points are written in this form?
> 
> (For instance, we would rewrite $((4, 7), 2)$ as $((8, 14), 2)$.)

> [!tip]- Solution
> Using this form, we can show that $(m_A A, m_A) + (m_B B, m_B) = (m_A A + m_B B, m_A + m_B)$. Note that this is just vector (component-wise) addition, which we already know is associative. 

## A triangle

The typical use case of this is as follows: draw a triangle $A, B, C$ and the point $D = A + B + C$. 

> [!note] Exercise
> If $A' = B + C$, show that $A + A' = D$. 
> ![[Pasted image 20260709000524.png|400]]

> [!tip]- Solution
> Just expand $A + A' = A + (B + C) = A + B + C$ by associativity!

Similar flavor but a bit harder:

> [!note] Exercise
> If $D = A + B + C$ and $A'$ is the intersection of line $A D$ and segment $overline(B C)$, prove that $A' = B + C$.

 > [!tip]- Solution
> 
> Since $A' = B + C$, [[#^cc1f19|the second exercise]] guarantees that $A'$ lies on $overline(B C)$. Moreover, since $D = A + (B + C) = A + A'$, $A'$ must lie on line $A D$ as well. Therefore, $A'$ is precisely the intersection between segment $overline(B C)$ and line $A D$.

Typically, we are not given the masses of $A, B,$ and $C$ but rather several side lengths from which the masses are to be deduced:

> [!note] Exercise
> ![[Pasted image 20260709001350.png|400]] 
> Assign masses to points $A, B,$ and $C$ such that $D = A + B + C$, then use these masses to calculate $(A B')/(B' C)$.

> [!info] Hint
> Use the "seesaw" property we learned from the [[#^cc1f19|second exercise]], as well as what we learned about $A', B',$ and $C'$ from the previous exercise!

> [!tip]- Solution
> Assume $D = A + B + C$. Then, by the previous exercise, we know that $C' = A + B, A' = B + C$, and $B' = C + A$. 
> 
> Because $C' = A + B$ and the seesaw property, we know that $m_A : m_B = 1 : 2$, so let's just assign $m_A := 1, m_B := 2$.
> 
>  Similarly, because $A' = B + C$ and the seesaw property, we have that $m_B : m_C = 2 : 3 => m_C = 3$.  Therefore, all three weights $(m_A, m_B, m_C) = (1, 2, 3)$ have been uniquely determined (up to a constant multiplication). We can now use the seesaw property with $B' = C + A$ to determine that $A B' : B' C = m_C : m_A = 3 : 1$.
