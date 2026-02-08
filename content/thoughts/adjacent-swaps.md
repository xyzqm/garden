---
title: Adjacent swaps
tags:
  - orders
---
## The Classic

Given a permutation of numbers $1...n$, what's the minimum number of adjacent swaps to sort it?

*Solution:* Define a metric, inversions, which satisfies two properties:
1) Can decrease by at most 1 in each operation
2) If positive, can always be decreased by exactly 1

Then, the desired answer is simply the number of inversions in the original permutation.

## A Variation

Given a string $S$, find the minimum number of adjacent swaps to transform it into a palindrome. ([LeetCode](https://leetcode.com/problems/minimum-number-of-moves-to-make-palindrome/description/))

*Solution:* We want to define another inversions-like metric for this situation. First, observe the following
