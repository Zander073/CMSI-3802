export function derivative(poly) {
    return differentiate([...parse([...tokenize(poly)])])
  }
  
  class Term {
    constructor(coefficient, exponent) {
      this.coefficient = Number(coefficient)
      this.exponent = Number(exponent)
    }
  }
  
  class Operator {
    constructor(lexeme) {
      this.lexeme = lexeme
    }
  }
  
  // The lexical grammar is:
  //
  //   term
  //     = coefficient "x^" exponent
  //     | coefficient "x"
  //     | coefficient
  //     | "x^" exponent
  //     | "x"
  //   coefficient
  //     = digit+ ("." digit+)?
  //   exponent
  //     = "-"? digit+
  
  function* tokenize(s) {
    let match
    for (let i = 0; i < s.length; i += match[0].length) {
      SkipSpaces: while (s[i] === ' ') i++
      if (match = /^(\d+(?:\.\d+)?)x\^(-?\d+)/.exec(s.substring(i))) {
        yield new Term(match[1], match[2])
      } else if (match = /^(\d+(?:\.\d+)?)x/.exec(s.substring(i))) {
        yield new Term(match[1], 1)
      } else if (match = /^(\d+)/.exec(s.substring(i))) {
        yield new Term(match[1], 0)
      } else if (match = /^x\^(-?\d+)/.exec(s.substring(i))) {
        yield new Term(1, match[1])
      } else if (match = /^x/.exec(s.substring(i))) {
        yield new Term(1, 1)
      } else if (match = /^[+-]/.exec(s.substring(i))) {
        yield new Operator(match[0])
      } else {
        throw new Error('Malformed Polynomial')
      }
    }
  }
  
  // The macrosyntax is:
  //
  //   Poly
  //     = "-"? term (("+" | "-") term)*
  
  function* parse(tokens) {
    let current = 0
  
    function at(expected) {
      return tokens[current]?.constructor === expected
    }
    
    function match(expected) {
      if (expected === undefined || at(expected)) {
        return tokens[current++]
      } else {
        throw new SyntaxError(`Expected: ${expected.name}`)
      }
    }
  
    let negative = false
    let op
    if (at(Operator)) {
      op = match()
      negative = op.lexeme === '-'
    }
    let term = match(Term)
    if (negative) term.coefficient = -term.coefficient
    yield term
    while (at(Operator)) {
        op = match()
        term = match(Term)
        if (op.lexeme === "-") term.coefficient = -term.coefficient
        yield term
     }
  }
  
  function differentiate(terms) {
    const newTerms = terms.map(t => new Term(t.exponent * t.coefficient, t.exponent - 1))
    let derivative = ""
    for (const t of newTerms) {
      if (t.coefficient === 0) continue
      if (t.coefficient > 0) derivative += "+"
      derivative += t.coefficient
      if (t.exponent != 0) {
        derivative += "x"
        if (t.exponent !== 1) {
          derivative += `^${t.exponent}`
        }
      }
    }
    return derivative === "" ? "0"
        : derivative.startsWith('+') ? derivative.substring(1)
        : derivative
  }