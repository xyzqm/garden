---
title: Flint and Steel
---
Let's consider the following subproblem: given an unordered subset of creepers, can we find an order
of detonation such that no creeper is killed before it is detonated?

A simple case where no such order exists is when the detonation intervals of two creepers both contain each other, like so:
```tikz
\begin{document}
\begin{tikzpicture}[scale=0.8, >=stealth]

  % Define a custom macro to draw the interval
  \newcommand{\itv}[3]{% #1=x, #2=r, #3=h
    % Horizontal line
    \draw[thick] (#1-#2, #3) -- (#1+#2, #3);

    % End markers as short vertical lines (like "|")
    \draw[thick] (#1-#2, #3-0.25) -- (#1-#2, #3+0.25);
    \draw[thick] (#1+#2, #3-0.25) -- (#1+#2, #3+0.25);

    % Filled circle in the middle
    \filldraw[fill=black] (#1, #3) circle (2pt);
  }

  % Draw the two intervals
  \itv{0}{3}{0}
  \itv{2}{3}{1}

\end{tikzpicture}
\end{document}

```
This turns out to be the _only_ case where no viable detonation order exists.
Moreover, it turns out that we can always just determine the detonation order by detonating the creepers
in order of increasing radius.

We can show this with a proof by contradiction. Assume that the smallest detonation interval, which belongs to creeper $x$, contains another creeper, $y$.
Then, according to our condition above, the detonation interval of creeper $y$ cannot contain creeper $x$.
However, this means that the detonation radius of creeper $y$ must be less than creeper $x$'s: a contradiction.

#my-canvas({
  import draw: * 
  let itv(x, r, h, c) = {
    line((x - r, h), (x + r, h), mark: (symbol: "|", width: 0.5cm), stroke: c) 
    circle((x, h), radius: 0.1, fill: c, stroke: c)
  }
  itv(0, 3, 0, black)
  itv(2, 1, 1, red)
  itv(2, 3, 2, red)
})

_The black represents creeper $x$, and the red represents possibilities for creeper $y$. Both are impossible because they either contradict our assumption that $x$ has the minimum radius, or the condition for validity stipulated above._

Now, the problem reduces to finding an _unordered_ subset of minimal size that satisfies the following requirements:
+ Together, the chosen detonation intervals must kill all creepers.
+ No two detonation intervals can contain each others' centers. 

This is easily done with DP + segment tree in $cal(O)(n log n)$.