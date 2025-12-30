---
title: Simple interpreter notes
---
## Functors
A functor $f$ most satisfy two properties:
1. When `id` is applied to $f$, the result must be $f$.
2. When $g.h$ is applied to $f$, the result must be equivalent to first applying $h$, then applying $g$.

Our `Parser` is a functor because we just apply the function to the current AST of our parser. Basically, a functor is anything to which a function can be _nicely_ applied (that is, it follows the rules outlined above).

`x <$ f` sets the contents of $f$ to the constant value $x$.

## Applicatives
An applicative type is a type which can be applied to itself. An example is a list:
```haskell
> [(*2), (+3)] <*> [1, 2, 3]
[2, 4, 6, 4, 5, 6]
```

Likewise, our parsers can also be applied to themselves. If $a$ and $b$ are parsers, $a.b$ simply corresponds to chaining the two parsers together.

The `pure` attribute of an applicative is just a way to wrap some function: `pure` $f$ will wrap the function $f$ into our desired type.

The `<*` and `*>` operators can chain applicatives together.

## Monads
```haskell
infixl 1  >>, >>=  
class  Monad m  where  
    (>>=)            :: m a -> (a -> m b) -> m b  
    (>>)             :: m a -> m b -> m b  
    return           :: a -> m a  
    fail             :: String -> m a  
  
    m >> k           =  m >>= \_ -> k
```

A monad is essentially a type that wraps a value and allows this value to be transformed.

`(>>)`: transforms a monad without reading its current value

### `do` blocks
```haskell
do e1 ; e2      =        e1 >> e2  
do p <- e1; e2  =        e1 >>= \p -> e2
```
