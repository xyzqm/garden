---
title: Eigenvectors
---
A bit of [[linear algebra]].

An **eigenvector** $v$ of a linear transformation $T$ satisfies the relation $T v = lambda v$ for some $lambda != 0$. In other words, $T$ only affects the *length* of its eigenvectors and leaves their direction unchanged.

> [!note]
> This idea extends to other linear operators too, not just matrices! For instance, the function $e^(lambda t)$ is an **eigenfunction** of the derivative operator $dif/(dif t)$. 

## Matrices

Consider $T = A$ for some matrix $A$. We want to solve the equation $A v = lambda v => (A - lambda I)v = 0$. This equation only has non-trivial solutions if $det(A - lambda I) = 0$, so we just need to solve this for $lambda$. 

### 2x2 Trick

I'll give a visual explanation for the neat trick shown [here](https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html) for computing eigenvectors.

First, note that if $det(A - lambda I) = 0$, the row vectors of $A - lambda I$ must be collinear, like: 
![[Pasted image 20260414180030.png|500]]
*B and C are the row vectors.*

Then, note that the set of vectors that are mapped to $0$ are precisely the ones perpendicular to both $B$ and $C$, i.e. the ones that lie along the blue line:
![[Pasted image 20260414180216.png|500]]

To finish, note that if $B = (x, y)$, then $(-y, x)$ will lie along this blue line. Thus, since $B = (a - lambda, b)$, the vector $(b, lambda - a)$ lies along the line. Similarly, $(lambda - d, c)$ also lines on the line. If either of these is not $(0, 0)$, we've found the eigenvector corresponding to $lambda$.

### Imaginary Eigenvalues

Consider the $(lambda, v)$ pair $lambda = alpha + omega i$, $v = bold(a) + bold(b) i$, where $bold(a), bold(b)$ are vectors (note that if the matrix itself has only real entries, there must exist a corresponding eigen-pair $(overline(lambda), overline(v))$).

How can we visualize the trajectory defined by the $(lambda, v)$ pair using only the real plane? For instance, when $lambda in RR$, the corresponding trajectory is just a stretch or shrink along the direction of $v$.

To visualize complex $lambda$, let's go into the basis ${bold(a), bold(b)}$. Note that in this basis, our transformation matrix becomes
$$
A = mat(alpha, -omega; omega, alpha) 
$$
This is because we have $A v = A bold(a) + A bold(b) i = lambda v = (alpha bold(a) - omega bold(b)) + (omega bold(a) - alpha bold(b)) i$. Thus,
$$
A bold(a) &= alpha bold(a) - omega bold(b) \
A bold(b) &= omega bold(a) - alpha bold(b)
$$
as desired.

Now, analyzing the polar form of $A$, we see that it satisfies
$$
dot(r) &= alpha r \
dot(theta) &= omega 
$$
thus
$$
r &= e^(alpha t) \
theta &= omega t
$$
So, the trajectory that starts at $(C_1, C_2)$ becomes the trajectory
$$
x(t) = C_1 (bold(a) cos(omega t) + bold(b) sin(omega t)) + C_2 (-bold(a) sin (omega t) + bold(b) cos(omega t))
$$


