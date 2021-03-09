import {randInt} from './random.js'

class AaToDnaTranlator extends HTMLElement {
    constructor(){
        super()
        this._shadow = this.attachShadow({mode: 'closed'})
    }

    connectedCallback(){
        const template = `
        <style>
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            .editor {
                display: flex;
            }
            .aa-input{
                flex-grow:1;
                margin-right:.5em;
            }
            .visualisation{
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .visualisation > div {
                margin-top: 0.5em;
            }
        </style>
        <div class="aa-to-dna-translator">
            <div class="editor">
                <input class="aa-input"></input>
                <button class="translate-btn">Translate</button>
            </div>
            <div class="result"></div>
            <div class="visualisation"></div>
        </div>
        `
        this._shadow.innerHTML = template

        const translateBtn = this._shadow.querySelector('.translate-btn')
        const aaInput = this._shadow.querySelector('.aa-input')
        translateBtn.onclick = () => this.findPossibleDNA(aaInput.value)
    }

    findPossibleDNA(aaSequence){
        this.#showCandidates([new Candidate(14), new Candidate(14)])
    }

    /**
     * replaces the displayed candidates with the new candidates
     * @param {Candidate[]} candidates the new candidates to display
     */
    #showCandidates(candidates){
        const visualisation = this._shadow.querySelector('.visualisation')
        while(visualisation.lastElementChild){
            visualisation.removeChild(visualisation.lastElementChild)
        }

        for(const c of candidates){
            this.#showCandidate(c)
        }
    }

    /**
     * appends a candidate to the visualisation section
     * @param {Candiate} candidate 
     */
    #showCandidate(candidate){
        const template = `
        <style>
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            .candidate {
                display: flex;
                flex-direction: column;
                width: 100%
            }
            .dna-sequence{
                color: grey;
                font-size: 0.5em;
            }
            .aa-sequence{
                color: black;
            }
        </style>
        <div class="candidate">
            <div class="dna-sequence">${candidate.dna}</div>
            <div class="aa-sequence">${candidate.aa}</div>
        </div>
        `
        const e = document.createElement('div')
        e.innerHTML = template
        this._shadow.querySelector(".visualisation").appendChild(e)
    }

    static #defaultAa = "X"
    static #dnaToAa = new Map([
        ["TTT", "F"],
        ["TTC", "F"],
        ["TTA", "L"],
        ["TTG", "L"],
        ["TCT", "S"],
        ["TCC", "S"],
        ["TCA", "S"],
        ["TCG", "S"],
        ["TAT", "Y"],
        ["TAC", "Y"],
        ["TAA", "*"],
        ["TAG", "*"],
        ["TGT", "C"],
        ["TGC", "C"],
        ["TGA", "*"],
        ["TGG", "W"],
        ["CTT", "L"],
        ["CTC", "L"],
        ["CTA", "L"],
        ["CTG", "L"],
        ["CCT", "P"],
        ["CCC", "P"],
        ["CCA", "P"],
        ["CCG", "P"],
        ["CAT", "H"],
        ["CAC", "H"],
        ["CAA", "Q"],
        ["CAG", "Q"],
        ["CGT", "R"],
        ["CGC", "R"],
        ["CGA", "R"],
        ["CGG", "R"],
        ["ATT", "I"],
        ["ATC", "I"],
        ["ATA", "I"],
        ["ATG", "M"],
        ["ACT", "T"],
        ["ACC", "T"],
        ["ACA", "T"],
        ["ACG", "T"],
        ["AAT", "N"],
        ["AAC", "N"],
        ["AAA", "K"],
        ["AAG", "K"],
        ["AGT", "S"],
        ["AGC", "S"],
        ["AGA", "R"],
        ["AGG", "R"],
        ["GTT", "V"],
        ["GTC", "V"],
        ["GTA", "V"],
        ["GTG", "V"],
        ["GCT", "A"],
        ["GCC", "A"],
        ["GCA", "A"],
        ["GCG", "A"],
        ["GAT", "D"],
        ["GAC", "D"],
        ["GAA", "E"],
        ["GAG", "E"],
        ["GGT", "G"],
        ["GGC", "G"],
        ["GGA", "G"],
        ["GGG", "G"],
    ])
    static availableTriplets = Array.from(AaToDnaTranlator.#dnaToAa.keys())

    /**
     * @param {string} dna a sequence of dna symbol triplets
     * @returns {string} aa sequence as string
    */
    static dnaToAa(dna){
        if(dna.length % 3 != 0){
            throw 'dna expected to be a multiple of 3 symbols long'
        }

        dna = dna.toUpperCase()

        let result = ""
        for(let i = 0; i <= dna.length -3; i += 3){
            const triplet = [dna[i], dna[i+1], dna[i+2]].join('')
            const aaSymbol = AaToDnaTranlator.#dnaToAa.get(triplet) || AaToDnaTranlator.#defaultAa
            result = result + aaSymbol
        }
        return result
    }
}

class Candidate{
    /**
     * @param {number} targetLength how long the AA sequence should be
     */
    constructor(targetLength){
        this.updateDna(this.#randomDna(targetLength))
    }

    updateDna(dna){
        this.dna = dna
        this.aa = AaToDnaTranlator.dnaToAa(this.dna)
    }

    #randomDna(targetLength){
        const availableTriplets = AaToDnaTranlator.availableTriplets
        const mapSize = availableTriplets.length
        const randomTriplets = Array(targetLength).fill(1).map(() => availableTriplets[randInt(mapSize)])
        return randomTriplets.join('')
    }
}

window.customElements.define('aa-to-dna-translator', AaToDnaTranlator)