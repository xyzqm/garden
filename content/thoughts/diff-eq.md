---
title: Differential equations
tags:
  - math
  - calculus
---
## Some fun ones

### Trigonometry...?

#### $dot(x) = 1 + x^2$

The form $1 + x^2$ is kind of reminiscent of Pythagorean theorem for a right triangle with legs $1$ and $x$. How can we use this to our advantage?

Consider the following setup: a lighthouse is situated at the origin and currently aims directly at the line $x = 1$. However, it rotates at a rate of $1 "rad"/s$, and we'd like to track the point of intersection between the lighthouse's beam and the line $x = 1$. 

![[Screen Recording 2026-01-28 at 4.05.53 PM.mov]]

Let the current point of intersection be $(1, h)$. Then, we'd like to know how much $h$ increases after $dif t$ seconds. 

![[Pasted image 20260128161816.png|500]]

Our goal is to find $D F$ in terms of $A D$. Let $r = C D$; then, by Pythagorean theorem, we know that $r^2 = 1 + h^2$. We also know that $E D$ is just a very small arc, so its length is $r dif t$. 

It remains to find $F D$ in terms of $E D$, which can be done by noting that $triangle.t D E F tilde.op triangle.t C A D$ . Therefore, $(F D)/(E D) = (D C) / (A C) = r$, meaning $dif h = F D = r^2 dif t =  (1 + h^2) dif t$, as desired.

Of course, $h$ is also simply $tan(t)$, therefore the solution to our original differential equation is simply
$$
x = tan(t + C)
$$

(remember to replace $t$ with $t + C$ since $x$ is a time-invariant system.)

Note that in the general case of $dot(x) = x^2 + a^2$ for $a > 0$, we must be careful to note that the solution is not just $x = a tan(t + C)$ but rather
$$
x = a tan(a(t + C))
$$

#### $dot(x) = sqrt(1 - x^2)$

We can also make a pretty nice geometric argument here in which $sqrt(1 - x^2) dif t$ is interpreted as the y-projection of an arc of length $dif t$. Details left to the reader, but solution turns out to be
$$
x = sin(t + C)
$$

### $dot(x) = c + f(t)x$

#### $dot(x) = 1 + x$

Without the $1$ on RHS, $x$ would just be $exp(t + C)$. Then, note that adding some constant $C$ to $x$ will leave the LHS unchanged while increasing the RHS by $C$. Therefore, we should just be $C = -1$ to get 
$$
x = exp(t + C) - 1
$$ 
#### $dot(x) = 1 + c/t x$

Again, let's try solving it without the $1$ on the RHS first. For which functions is differentiation equivalent to multiplication by $c/t$? This is just the class of functions $C t^c$. 

This time, note that we cannot just add a constant $C$ to $x$, otherwise the RHS will have a nasty $C/t$ term. However, what if we add a $C t$ term? Then the *LHS* will increase by $C$ while the RHS increases by $c C$. Therefore we want $C = 1 + c C => C = 1/(1 - c)$. So, our final solution is

$$
x = t/(1 - c) + C t^c
$$