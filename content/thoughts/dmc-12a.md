---
title: DMC 12A
tags:
  - math
  - mocks
---
![[Pasted image 20251031111539.png]]
Abuse the symmetry of the first two constraints and multiply them together to get $a b : a b c^2 = 1 : 36 => 1 : c^2 = 1 : 36 => c = 6$.

![[Pasted image 20251031111843.png]]
The symmetric setup motivates finding the _inradius_ of the large triangle, which is $1 + sqrt(3)$. 

![[Pasted image 20251031112248.png]]
We can show that the condition is satisfied iff ${(n + 1)pi} < {pi}$, where ${x}$ denotes the fractional part of $x$. Using the fact that $pi approx 22/7$ and also $pi < 22/7$, we get that when $n$ increases by $7$, ${(n + 1)pi}$ decreases by a little more than $0$. Since $n$ is small, this means our condition will hold for $n = 7k$, or $14$ different values.
 
 ![[Pasted image 20251031113659.png]]
The possibilities for $P$ lie on the circle with diameter $A B$. Then, our ellipse constraint allows for at most $4$ possibilities of $P$, and these possibilities will be symmetric in each quadrant. Therefore, the area-maximizing shape is a square inscribed in the circle. 