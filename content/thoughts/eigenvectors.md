---
title: Eigenvectors
---
A bit of [[linear algebra]].

An **eigenvector** $v$ of a linear transformation $T$ satisfies the relation $T v = lambda v$ for some $lambda != 0$. In other words, $T$ only affects the *length* of its eigenvectors and leaves their direction unchanged.

> [!note]
> This idea extends to other linear operators too, not just matrices! For instance, the function $e^(lambda t)$ is an **eigenfunction** of the derivative operator $dif/(dif t)$. 

## Matrices

Consider $T = A$ for some matrix $A$. We want to solve the equation $A v = lambda v => (A - lambda I)v = 0$. This equation only has non-trivial solutions if $det(A - lambda I) = 0$, so we just need to solve this for $lambda$. 

### 2x2

I'll give a visual explanation for the neat trick shown [here](https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html) for computing eigenvectors.

First, note that if $det(A - lambda I) = 0$, the row vectors of $A - lambda I$ must be collinear, like: 
![[Pasted image 20260414180030.png|500]]
*B and C are the row vectors.*

Then, note that the set of vectors that are mapped to $0$ are precisely the ones perpendicular to both $B$ and $C$, i.e. the ones that lie along the blue line:
![[Pasted image 20260414180216.png|500]]

To finish, note that if $B = (x, y)$, then $(-y, x)$ will lie along this blue line. Thus, since $B = (a - lambda, b)$, the vector $(b, lambda - a)$ lies along the line. Similarly, $(lambda - d, c)$ also lines on the line. If either of these is not $(0, 0)$, we've found the eigenvector corresponding to $lambda$.
