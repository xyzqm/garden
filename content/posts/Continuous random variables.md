---
description: How to visualize and transform continuous random variables.
---

## Visualizing PDFs

![[Pasted image 20260910184933.svg]]

The plots I've included are the typical way to visualize PDFs, but I much prefer to visualize them as the number lines below because it gives you a more visceral sense of "density". Implementation-wise, I've just sampled 300 values from each distribution and plotted each as a red dot with opacity 0.12. 

## Transforming variables

If I know the PDF of $X$, how can I find the PDF of $2X$? 

Using our number line visual, let's animate the transform from some random variable $X$ to $2 X$:

![[Pasted image 20260910191558.svg]]

Observe two things:
1. A point originally at $x$ moves to $2 x$.
2. The density at every point is halved.

Therefore, 
$$
f_X (x) dot 1/2 = f_(2X) (2x).
$$ 
(Typically, we rearrange this as  $f_(2X)(x) = 1/2 dot f_X (x / 2)$, but I find the first expression more enlightening.)


Let's tackle a slightly more challenging transform, $X -> X^2$. 

![[Pasted image 20260911081702.svg]]

Note that the density is no longer uniformly stretched by a factor of $2$; instead, the density at point $x$ will get stretched by $|(x^2)'| = 2 |x|$. Therefore for $x >= 0$,
$$
(f_X (x) + f_X (-x)) dot 1/(2 x) = f_(X^2)(x^2).
$$

> [!note] Exercise
> In general, what is the PDF of $g(X)$ in terms of $f_X$ and $g$?  



