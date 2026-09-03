---
tags:
  - cs
  - flows
description: Two proofs of Hall's marriage theorem, and problems.
---
## Statement

Hall's marriage theorem gives a necessary and sufficient condition for whether a bipartite graph has a perfect matching: for every $S subset L$, if $T$ is the neighborhood of $S$ in $R$, then $|S|$ must be $<= |T|$. Here, the neighborhood of $S$ refers to the set of all nodes in $R$ that are connected directly to a node in $S$. 

![[Pasted image 20260620140759-3.png|bg-white|400]]

*An $X$-perfect matching. We can verify Hall's condition on, for instance, $S = {1, 2, 3}$, whose neighborhood is the first four nodes in $Y$. $|S| = 3 < 4$, therefore the condition is satisfied.*
## Proof 1 (Flows)

If there exists $|S|$ with $|S| > |T|$, then a perfect matching is obviously impossible. It remains to prove sufficiency, which can also be done fairly easily by the max-flow min-cut theorem (for more, see [[flow]]).

Set up the following flow network: 
- Connect the source node with edges of capacity 1 to every node in $X$.
- Direct every edge between $X$ and $Y$ toward $Y$ with capacity $oo$.
- Connect every node in $Y$ to the sink with edges of capacity $1$. 

Clearly, a flow in this network corresponds to a matching on the original bipartite graph. Now, consider any cut in this flow network with finite capacity. Let $S$ be the set of nodes in $X$ which are still connected to the source. Then, the smallest set $T$ we can cut on the right side is exactly the neighborhood of $S$. The size of the resultant cut is then $(|X| - |S|) + |T|$, but since we have $|S| <= |T|$ for all $|S|$, this quantity must then be $>= |X|$ for all possible cuts, and thus the min-cut is exactly $|X|$ with equality achieved when $S = emptyset$. Therefore, an $|X|$-flow must exist.

## Proof 2 (Constructive)

We induct, and consider 2 cases. 

**Case 1: For every $S$ with $|S| < |L|$ and its neighborhood $T$, $|S| < |T|$.**  In this case, we can just pair any two connected nodes $u$ and $v$, as this decreases the RHS of the above inequality by at most 1 for all $S$. 

**Case 2: There exists $S$ with $|S| < |L|$ and $|S| = |T|$.**  By induction, we can perfectly match $S$ to $T$. Every remaining subset will still satisfy Hall's condition because $|S|$ is subtracted from the LHS and at most $|T| = |S|$ is subtracted from the RHS.

## Takeaways

I think this theorem is quite beautiful as it essentially just compounds necessary conditions until their sum ends up being sufficient. What I mean is this:

When you see the problem, you'll likely observe that trivially, $|X|$ must be $<= |Y|$, which is certainly necessary but definitely not sufficient. But then you simply apply this condition to all subsets of $X$, and that turns out to be sufficient! Isn't that elegant?

## Problems

There are $2n$ candies, each with a potentially different color. Determine whether it's possible to split them into $n$ pairs such that no pair contains two candies of the same color.

> [!note]- Solution
>  To use Hall's theorem, we just need to find whether there exists a way to split the $2n$ candies into $n$ nodes on the left and $n$ nodes on the right, with edges between candies of both opposite side and color, such that Hall's condition is satisfied.
>  
>  First, observe that if $S$ contains candies of at least two colors, its neighborhood is all $n$ nodes on the right side. Therefore, we only need to consider mono-colored $S$. 
>  
>  Note that if there are $x$ candies of color $i$ on the left side, there must be at most $n - x$ candies of color $i$ on the right side by Hall's condition. It is therefore both necessary and sufficient that there are $<= n$ candies of each color.
>  
>  There also exists a more direct inductive argument that is very similar to the one shown above. We again split into two cases. 
>  - If there exists a color $i$ that occurs exactly $n$ times, simply pair off each of the other $n$ candies with a candy of color $i$. For instance, if our colors were $[1, 1, 1, 2, 3, 4]$, we would just pair $(1, 2), (1, 3), (1, 4)$.
>  - Otherwise, we can just remove any pair. 

The next few problems are from https://cjquines.com/files/halls.pdf. Also in solutions, $N(W)$ will denote the neighborhood of $W$.

![[Pasted image 20260620140759-4.png]]

> [!note]- Solution
> Construct the graph in which each of the 4006 polygons is a vertex, and an edge is drawn between two vertices if their corresponding polygons can be pierced by a single pin. Now we just need to show that for every set of polygons $W$, $|W| <= |N(W)|$. Since all polygons have area 1, $|W|$ and $|N(W)|$ are precisely the areas of $W$ and $N(W)$ respectively, so our desired inequality easily follows since the area defined by $N(W)$ must strictly contain $W$. 

![[Pasted image 20260620140759-5.png]]

> [!note]- Solution
> Consider the graph in which each row and column its own vertex (so 16 vertices total), and a piece in position $(i, j)$ corresponds to an edge between nodes $r_i$ and $c_j$. The $n$ constraint means that the degree of every node in this graph is exactly $n$. 
> 
> Now, for any $W$, the amount of edges incident to $W$ cannot exceed the amount incident to $N(W)$. Applying the $n$ constraint, we then have $n|W| <= n|N(W)|$, which means $|W| <= |N(W)|$ for all $W$ as desired.

