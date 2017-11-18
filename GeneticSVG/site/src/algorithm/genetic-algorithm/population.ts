import * as I from './_interfaces'

export default class Population<Specimen extends I.ISpecimen> extends Array<Specimen> implements I.IPopulation<Specimen> {
}