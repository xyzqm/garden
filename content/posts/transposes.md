---
title: Transposes
tags:
  - math/linear-algebra
---
Transposes are inextricably linked to the concept of *duality*. 

The transpose of a vector is its dual vector: $v^T$ essentially represents the operation "project onto $v$", and it can be applied to some vector $x$ simply by left-multiplying, i.e. $v^T x$.
Therefore, $v^T$ should primarily be thought of as a *function*.

One way to visualize a row vector $v^T$ is by drawing its level curves.
That is, for each integer $k$, we draw a single line representing
all vectors $x$ such that $v^T x = k$. 
For instance, here's how we'd represent the row vector $[1, 1]$:

```tikz
\begin{document}
  \begin{tikzpicture}[domain=0:4]
    \draw[very thin,color=gray] (-0.1,-1.1) grid (3.9,3.9);
    \draw[->] (-0.2,0) -- (4.2,0) node[right] {$x$};
    \draw[->] (0,-1.2) -- (0,4.2) node[above] {$f(x)$};
    \draw[color=red]    plot (\x,\x)             node[right] {$f(x) =x$};
    \draw[color=blue]   plot (\x,{sin(\x r)})    node[right] {$f(x) = \sin x$};
    \draw[color=orange] plot (\x,{0.05*exp(\x)}) node[right] {$f(x) = \frac{1}{20} \mathrm e^x$};
  \end{tikzpicture}
\end{document}
```


```tikz
\usepackage{pgfplots}
\begin{document}
\begin{tikzpicture}
\begin{axis}[axis lines = left]
	\addplot[color=red]{exp(x)};
\end{axis}
\end{tikzpicture}
\end{document}
```




