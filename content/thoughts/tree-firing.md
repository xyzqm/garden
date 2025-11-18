---
title: Tree firing
tags:
  - graphs
---
You are given a tree, and each node is initially assigned a non-negative amount of tokens, $t_i$. In each second, if a node $i$ has at least as many tokens as its degree, $d_i$, it gives exactly one token to each of its neighbors. Prove that eventually, the configuration is either constant or periodic with period 2.

```tikz
\begin{document}
\begin{tikzpicture}[every node/.style={circle, draw}]
  \node {1}
    child { node {2} }
    child { node {3} }
    child { node {4} }
    child { node {5} }
  ;
\end{tikzpicture}
\end{document}
```
For instance, in this tree, if node 1 starts with 3 tokens and the others start with none, the token counts will evolve as follows:
$$
[3, 0, 0, 0] =>  [0, 1, 1, 1] => [3, 0, 0, 0] => [0, 1, 1, 1] => ...
$$
which has period 2, as desired.

Let's color nodes with $t_i >= d_i$  black and nodes with $t_i < d_i$ white.

> [!note] Observation 1
> For every black node $i$, $t_i$ is non-increasing. Moreover, if in a given second, $i$ is adjacent to at least one white node, $t_i$ must decrease.

**Proof:** In each second, a black node gives away exactly $d_i$ tokens, and receives at most $d_i$ tokens in return. Every adjacent white node decreases the amount of tokens received.

> [!note] Observation 2
> For every node $i$ in the long run, there are two possibilities:
> 1. $i$ ends up black and always surrounded only by black nodes.
> 2. $i$ becomes white.

**Proof:** Assume 1 is not true. Then, by Observation 1, $t_i$ will continue to decrease until node $i$ becomes white.

Note that if possibility 1 is true for one node, it must be true for all nodes. Therefore, the only case which satisfies possibility 1 is if all nodes end up black, which leads to a constant configuration.

Thus, from here we can assume that every node $i$ eventually becomes white.

> [!note] Observation 3
> Let $s_i$ be the first time node $i$ hits its minimum $t_i$. For all seconds $s > s_i$, $i$ is black iff all its neighbors were black in second $s - 1$.

**Proof:** If all neighbors of $i$ are black in second $s - 1$, $t_i$ increases by $d_i$ and thus must be black in second $s$.

In the opposite direction, assume not all neighbors were black in second $s - 1$. Then, $t_i$ increases by $x < d_i$, and node $i$ becomes black. However, once $i$ becomes white again (which, per our assumption above, must happen) $t_i$ will decrease by $d_i$, which means it will have decreased overall from the last time it was white. This contradicts are assumption that $s_i$ was the time of minimum $t_i$.

Considering only times greater $max(s_i)$, we have simplified our problem model to the following:
1. Every node is either black or white.
2. If all a node's neighbors are black in second $s$, that node is black in second $s + 1$. Otherwise, it must be white.

```tikz
\begin{document}
\begin{tikzpicture}[every node/.style={circle, draw, fill=black, text=white}]
  \node[fill=white, text=black] {1}
    child { node {2} }
    child { node {3} }
    child { node {4} }
    child { node {5} }
  ;
\end{tikzpicture}
\end{document}
```


```tikz
\begin{document}
\begin{tikzpicture}[every node/.style={circle, draw}]
  \node[fill=black, text=white] {1}
    child { node {2} }
    child { node {3} }
    child { node {4} }
    child { node {5} }
  ;
\end{tikzpicture}
\end{document}
```

_The two possible states of our initial example._

> [!note] Observation 4
> If there are ever two adjacent white nodes, all nodes will eventually become white.

**Proof**: Exercise to the reader.

Note that any configuration with only white nodes is also constant. Therefore, we now only need to consider configurations where there are never adjacent white nodes.

> [!note] Observation 5
> Any configuration (with at least one white node) that never has adjacent white nodes will also end up with no adjacent black nodes.

**Proof:** Consider any white node $i$. Per our condition, it must be surrounded by all black nodes. Notice that after 2 seconds, node $i$ will still be white, all nodes adjacent will still be black, but now the nodes two steps away from node $i$ will be white as well.

Therefore, the black and white nodes form a _bipartition_ of the tree. Showing that any such configuration has period 2 is left as an exercise to the reader.
```tikz
\begin{document}
\begin{tikzpicture}[every node/.style={circle, draw}]
  \node[fill=black, text=white] {1}
    child { node {2} }
    child { node {3} 
    child { node[fill=black, text=white] {4} }
    child { node[fill=black, text=white] {5} }
    }
  ;
\end{tikzpicture}
\end{document}
```

```tikz
\begin{document}
\begin{tikzpicture}[every node/.style={circle, draw, fill=white, text=black}]
  \node {1}
    child { node[fill=black, text=white]{2} }
    child { node[fill=black, text=white] {3} 
    child { node {4} }
    child { node {5} }
    }
  ;
\end{tikzpicture}
\end{document}
```

_A possible ending configuration._