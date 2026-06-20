---
title: Transposes
tags:
  - linear
---
[A good background video](https://youtu.be/LyGKycYT2v0?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)

Transposes are inextricably linked to the concept of *duality*. 

The transpose of a vector is its dual vector: $v^T$ essentially represents the operation "project onto $v$", and it can be applied to some vector $x$ simply by left-multiplying, i.e. $v^T x$.
Therefore, $v^T$ should primarily be thought of as a *function*.

One way to visualize a row vector $v^T$ is by drawing its level curves.
That is, for each integer $k$, we draw a single line representing
all vectors $x$ such that $v^T x = k$. 
For instance, here's how we'd represent the row vector $[1, 1]$:


```tikz
\usepackage{pgfplots}
\pgfplotsset{compat=1.16}

\begin{document}
\begin{tikzpicture}
  \begin{axis}[
    axis lines = middle,
    axis equal,
    xmin = -5, xmax = 5,
    ymin = -5, ymax = 5,
    samples = 2,            % lines are linear, so only two points are needed
    domain = -5:5,
    axis line style = {->},
    xlabel = {$x$},
    ylabel = {$y$},
    tick style = {black},
  ]
    % Draw lines y = -x + i for i from -10 to 9
    \foreach \i in {-10,...,9} {
      \addplot[blue!50, thin] { -x + \i };
    }
  \end{axis}
\end{tikzpicture}
\end{document}
```



The line going through the origin corresponds to $k = 0$, and the line going through $(0, 1)$ and $(1, 0)$ corresponds to $k = 1$.

Note that scaling up the vector will simply make the level curves more dense. Shown below are the level curves for $v^T = [2, 2]$:

```tikz
\usepackage{pgfplots}
\pgfplotsset{compat=1.16}

\begin{document}
\begin{tikzpicture}
  \begin{axis}[
    axis lines = middle,
    axis equal,
    xmin = -5, xmax = 5,
    ymin = -5, ymax = 5,
    axis line style = {->},
    xlabel = {$x$},
    ylabel = {$y$},
    tick style = {black},
  ]
    % Draw lines y = -x + i for i from -10 to 9
    \foreach \i in {-20,...,20} {
      \addplot[blue!50, thin] { -x + \i * 0.5 };
    }
  \end{axis}
\end{tikzpicture}
\end{document}
```

> [!info] Lemma
> The distance between the level curves of $v$ is $1/(|v|)$.

^lemma

Now, we'll use this visualization to prove the following identity geometrically:
> [!note] Theorem
>  For any 2x2 matrix $A$, $det(A) = det( A^T )$.

As a quick refresher, $det([x_1 thick x_2])$ is the signed area of the parallelogram defined by the column vectors $x_1$ and $x_2$. For instance, $det(mat(1,4;2,1;))$ represents the following area:

```tikz
\usepackage{pgfplots}
\pgfplotsset{compat=1.16}

\begin{document}
\begin{tikzpicture}
  \begin{axis}[
    axis lines = middle,
    axis equal,
    xmin = -1, xmax = 5,
    ymin = -1, ymax = 4,
    xlabel = {$x$},
    ylabel = {$y$},
    samples = 2,
    domain = -1:5,
    enlargelimits = 0.05,
    grid = none,
    axis line style={thick,->},
    tick style = {black},
    every axis x label/.style={at={(ticklabel* cs:1)}, anchor=west},
    every axis y label/.style={at={(ticklabel* cs:1)}, anchor=south},
  ]

    % Define coordinates
    \coordinate (O) at (0,0);
    \coordinate (x1) at (1,2);
    \coordinate (x2) at (4,1);
    \coordinate (sum) at (5,3);

    % Parallelogram fill
    \fill[blue!20] (O) -- (x1) -- (sum) -- (x2) -- cycle;

    % Vectors
    \draw[thick,->,blue!70] (O) -- (x1) node[midway, left, blue!50] {$x_1$};
    \draw[thick,->,blue!70] (O) -- (x2) node[midway, below, blue!50] {$x_2$};

    % Dashed sides of parallelogram
    \draw[dashed, blue!30] (x1) -- (sum);
    \draw[dashed, blue!30] (x2) -- (sum);

    % Labels

  \end{axis}
\end{tikzpicture}
\end{document}
```
Equivalently, the determinant is the *scale factor* by which $A$ transforms the area of any shape.

Now, how do we visualize the scaling induced by $A^T$? It will actually be easier to visualize this
in the backwards direction---that is, to find the area of the shape that $A^T$ maps to the unit square.
If this area is $x$, then we hope to show that $det(A) = 1/x$.

Let's draw in level curves for $A = mat(1,4;2,1;)$. Then, by definition of the level curves, the shape which $A^T$ maps to the unit square is precisely the shaded region:
```tikz
\usepackage{pgfplots}
\pgfplotsset{compat=1.16}

\begin{document}
\begin{tikzpicture}
  \begin{axis}[
    width=10cm, height=10cm,
    axis equal image,
    xmin=-1, xmax=1,
    ymin=-1, ymax=1,
    axis lines=middle,
    xlabel={$x$}, ylabel={$y$},
    grid=none,
    tick style={black},
    domain=-1:1, samples=2,
  ]

    % First contour family: 4x + y = const
    \foreach \c in {-5,...,4} {
      \addplot[blue!40, thin] expression[domain=-1:1] { -4*x + \c };
    }

    % Second contour family: x + 2y = const
    \foreach \c in {-5,...,4} {
      \addplot[red!40, thin] expression[domain=-1:1] { (-x + \c)/2 };
    }

    % Red filled quadrilateral
    \fill[red!30, fill opacity=0.6]
      (axis cs:0,0)
      -- (axis cs:0.28571,-0.14286)
      -- (axis cs:0.14286,0.42857)
      -- (axis cs:-0.14286,0.57143)
      -- cycle;

  \end{axis}
\end{tikzpicture}
\end{document}
```
Now, how can we relate the area of this parallelogram to our first one? Well,
according to [[transposes#^lemma|our lemma]], the two altitudes of the new parallelogram are $1/(|x_1|)$ and $1/(|x_2|)$, respectively. We also know that the two altitudes of the original parallelogram are $det(A)/(|x_1|)$ and $det(A)/(|x_2|)$, respectively. 
And since the two parallelograms have the same angles, this means that they must be *similar*: the new one is just the original one scaled by a factor of $1/det(A)$!
This means the area of our new parallelogram is simply
$$
det(A) (1/det(A))^2 = 1/det(A)
$$
as desired.

By the way, the basis which defines the second parallelogram has a special name: it is the [dual basis](https://en.wikipedia.org/wiki/Dual_basis) of $A$. 

Also unfortunately, this similarity argument doesn't seem to extend to higher dimensions. However, I hope it still provided a more visceral feel for what exactly the transpose does, and how
it's visually related to the original basis.