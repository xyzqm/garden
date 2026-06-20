---
title: "AGC 076: Split and Reverse"
tags:
  - cs
  - ad-hoc
---
You can find the problem statement [here](https://atcoder.jp/contests/agc076/tasks/agc076_b).

Let's first try to characterize the arrays which can be sorted in one operation. First, note that if we have an array like
```
11....1|01001|0...00
```
Then WLOG, let the first `0` from the left belong to group `A` and the first `1` from the right belong to group `B`. Then, the `0` can only be followed by more `0`s, and similarly the `1` can only be preceded by more `1`s.

Let's just consider `A` for now. After reversing it, it is necessary and sufficient that the array looks like:
```
00..0.0.|1...1.1..
```
where `|` denotes the last position, $C$, of `0` in the sorted array, and the `.`s represent the indices of `B`. So, a valid `A` would be something like
```
1100|00
```
whereby after reversing all `0`s come  before the divider, and all `1`s come after. From here, it's not hard to see that the number of $1$s before the divider must equal the number of $0$s afterward. If the position of the leftmost $0$ is $L$, then we can use at most $L - 1$ 1s, therefore we have $L - 1 >= D$ as both a necessary and sufficient condition (where $D$ is the number of $0$s to the right of the divider).

Now, note that any array of the form
```
??????|11000
```
can be sorted in one operation: we can just place all `0`s before the divider in `A`, and everything else in `B`. Similarly, we can sort any array of the form
```
11000|?????
```
in one operation as well.

For the final observation, note that any array can be transformed into one of the two forms above in one operation. Therefore, are arrays are sortable within two operations.