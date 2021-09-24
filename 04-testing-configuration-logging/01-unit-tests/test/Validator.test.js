const Validator = require('../Validator');
const expect = require('chai').expect;

const stringRules = {
  name: {
    type: 'string',
      min: 10,
      max: 20,
  },
};

const numberRules = {
  age: {
    type: 'number',
    min: 25,
    max: 40,
  },
};

const stringValidator = new Validator(stringRules);
const numberValidator = new Validator(numberRules);

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    describe(('валидатор проверяет объект правил'), () => {
      it(('данные не переданы в валидатор'), () => {
        const errors = new Validator().validate({ name: 78 });

        expect(errors[0]).to.have.property('error').and.to.be.equal('expect object, got undefined');
      });

      it(('переданные данные имеют некорректный тип'), () => {
        const rules = 'ghj';
        const errors = new Validator(rules).validate({ name: 78 });

        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect object, got ${typeof rules}` );
      });
    });

    describe('валидатор проверяет строковые поля', () => {
      it('некорректный тип поля', () => {
        const errors = stringValidator.validate({ name: 78 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('длина строки слишком короткая', () => {
        const errors = stringValidator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('длина строки слишком длинная', () => {
        const errors = stringValidator.validate({ name: 'Lalala Lalala Lalala Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 27');
      });

      it('cтрока пустая', () => {
        const errors = stringValidator.validate({ name: '' });

        expect(errors).to.have.length(2);
        expect(errors[1]).to.have.property('field').and.to.be.equal('name');
        expect(errors[1]).to.have.property('error').and.to.be.equal('string can not be empty');
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      it('некорректный тип поля', () => {
        const errors = numberValidator.validate({ age: 'Lala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('число слишком маленькое', () => {
        const errors = numberValidator.validate({ age: 22 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 25, got 22');
      });

      it('число слишком большое', () => {
        const errors = numberValidator.validate({ age: 42 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 40, got 42');
      });

      it('число явлется отрицательным', () => {
        const errors = numberValidator.validate({ age: -8 });

        expect(errors).to.have.length(2);
        expect(errors[1]).to.have.property('field').and.to.be.equal('age');
        expect(errors[1]).to.have.property('error').and.to.be.equal('can not be negative');
      });
    });
  });
});
