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

function* tokenize(s) {
    // Yield new Term(coefficient, exponent)
    // Yield new Operator("+")
}

function* parse(tokens) {
    function at(expected) {

    }

    function match(expected) {

    }
}

function differentiate() {}