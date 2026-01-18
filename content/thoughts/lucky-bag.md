---
title: Lucky Bag (福袋）
tags:
  - dp
  - combo
---
## Statement

Partition $n$ into any number of positive integers in the range $[l, r]$. Two partitions are considered distinct if the multiset of weights is distinct---that is, $3 + 2 + 1$ is identical to $1 + 2 + 3$. Find the expected number of values that occur $>= k$ times.

$1 <= l <= r <= n$ 

$k <= n <= 5 dot.op 10^5$

## Solution

Let $w_n$ denote the number of valid partitions of $n$ as defined above. For instance, if $n = 5$, $l = 1$, and $r = 2$, there are $w_n = 3$ valid partitions:
- $1 + 1 + 1 + 1 + 1$
- $1 + 1 + 1 + 2$
- $1 + 2 + 2$

Note that if we find $w_x$ for all $x in [0, n]$ then we can easily solve the given problem by enumerating the value that occurs $k$ times:

```cpp
int sm = 0;
for (int i = l; i <= r; i++) { // enumerate the value with >= k occurences
	if (n - k * i >= 0) ad(sm, ws[n - k * i]);
}
cout << (sm * inv(ws[n]) % M) << endl;
```

Here, $"ws[x]" = w_x$. 

Now, it just remains to quickly compute $w_x$.

### $cal(O) (n r)$

This is just a standard knapsack.

```cpp
ws[0] = 1;
for (int i = l; i <= r; i++) {
	for (int j = i; j <= n; j++) ad(ws[j], ws[j - i]);
}
```

### $cal(O) (n^2 / l)$

The above algorithm is very slow when values are large, but we can observe that when all values are sufficiently large, the number of total items we can take then in turn decreases. To be precise, the number of elements taken is upper bounded by $n / l$. How can we use this to our advantage?

For now, let's assume $r = n$. Then, if we have some partition with $x$ items, we always have two choices:
1. Increment all items by $1$, thereby increasing sum by $x$.
2. Add an item with weight $l$, which transitions from $x$ items to $x + 1$. 

For instance, if $l = 2$, we could achieve the configuration ${2, 2, 3, 4}$ by the following process.
1. ${} -> {2}$ with operation 2 
2. ${2} -> {3}$ with operation 1
3. ${3}->{2, 3}$ with operation 2
4. ${2, 3} -> {3, 4}$ with operation 1
5. ${3, 4} -> {2, 3, 4}$ with operation 2
6. ${2, 3, 4} -> {2, 2, 3, 4}$ with operation 2

Therefore, our DP has a total of $n dot.op n / l$ states and each can transition in $cal(O)(1)$ for an overall complexity $cal(O)(n^2 / l)$. 

We need one more clever observation to handle the case when $r < n$. Observe that if we currently have a valid configuration, applying operation 2 can never make it invalid. Therefore, we only need to worry about operation 1.

Any valid configuration that becomes invalid after applying operation 1 must have at least one occurrence of $r$. Therefore, note that every such configuration that has sum `sm` and `x` items bijects to a valid configuration with sum `sm - r` and `x - 1` items.

For instance, if $r = 4$, the configuration ${2, 3, 4, 4}$ bijects to ${2, 3, 4}$. Therefore, the number of configurations for which we are allowed to apply operation 1 is simply `dp[x][sm] - dp[x - 1][sm - r]`. 
### $cal(O) (n sqrt(n))$ 

Just put these two solutions together!

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int int64_t

const int M = 998244353;
void ad(int &a, const int b) { if ((a += b) >= M) a -= M; }
void sb(int &a, const int b) { if ((a -= b) < 0) a += M; }
int inv(int x) {
    int iv = 1;
    for (int pw = M - 2; pw; x = x * x % M, pw >>= 1) if (pw & 1) iv = iv * x % M;
    return iv;
}

const int B = 700;

int32_t main() {
    cin.tie(0)->sync_with_stdio(0);
    int n, k, l, r; cin >> n >> k >> l >> r;

    // first process items with weight < B
    auto dp = array{vector<int>(n + 1), vector<int>(n + 1)};
    dp[1][0] = 1;
    for (int i = l; i < min(r + 1, B); i++) for (int j = i; j <= n; j++) ad(dp[1][j], dp[1][j - i]);
    auto ws = dp[1]; // ws[i] = # of ways to make a sum of i

    // process items with weight >= B
    if (r >= B) {
        int lb = max(l, B);
        for (int i = 1; i <= n / lb; i++) { // i = # of items with weight >= B
            dp[0].swap(dp[1]);
            dp[1].assign(n + 1, 0);
            for (int j = (i - 1) * lb; j <= n; j++) {
                ad(ws[j], dp[1][j]);
                if (j + i <= n) {
                    int ws = dp[1][j];
                    if (j >= r) sb(ws, dp[0][j - r]); // subtract off invalid configurations
                    ad(dp[1][j + i], ws);
                }
                if (j + lb <= n) ad(dp[1][j + lb], dp[0][j]);
            }
        }
    }

    int sm = 0;
    for (int i = l; i <= r; i++) { // enumerate the marked value which appears >= k times
        if (n - k * i >= 0) ad(sm, ws[n - k * i]);
    }
    cout << (sm * inv(ws[n]) % M) << endl;
}
```
