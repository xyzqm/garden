---
title: Huffman coding
---
1. by exchange argument, two least occuring words should be at deepest depth. also if there exists an optimal arrangement where these two are deepest but they are not siblings, swapping them to be siblings is still optimal. 
2. therefore, we know the two least occuring must be siblings. now combine them into one word w/ frequency f_1 + f_2, and the answer for subproblem n is (the answer for subproblem n - 1) + (f_1 + f_2). we can now recursively minimize subproblem n - 1.