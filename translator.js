import {randInt, weightedPick} from './random.js'

class AaToDnaTranlator extends HTMLElement {

    #epsilon = 0
    #populationSize = 200
    #mutationRate = 0.01
    #maxGenerations = 10000

    #bestSoFar = undefined
    #currentGeneration = undefined
    #abort = false

    #startLabel = 'Translate'
    #stopLabel = 'Stop'

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
            .aa-to-dna-translator{
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            .editor {
                display: flex;
            }
            .aa-input{
                flex-grow:1;
                margin-right:.5em;
            }
            .result {
                display:flex;
                flex-direction: column;
                margin-bottom: 0.5em;
                margin-top: 0.5em;
                border: solid 0.1em;
            }
            .result > * {
                margin-bottom: 0.5em;
            }
            .statistics{
                display:flex;
                background-color: lightgrey;
            }
            .statistics > * {
                padding: 0.25em;
            }
            .visualisation{
                display: flex;
                flex-direction: column;
                justify-content: left;
                align-items: center;
                overflow: auto;
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
            <div class="result">
                <div class="statistics"></div>
                <div class="best-candidate"></div>
            </div>
            <div class="visualisation"></div>
        </div>
        `
        this._shadow.innerHTML = template
        this.style.height = '100%'
        this.style.width = '100%'

        this._shadow.querySelector('.result').style.display = 'none'

        this.#stopAction()
    }

    #startAction(){
        const translateBtn = this._shadow.querySelector('.translate-btn')
        const aaInput = this._shadow.querySelector('.aa-input')

        this.#abort = false
        translateBtn.textContent = this.#stopLabel
        translateBtn.onclick = () => this.#stopAction()

        this.findPossibleDNA(aaInput.value)
    }

    #stopAction(){
        const translateBtn = this._shadow.querySelector('.translate-btn')

        this.#abort = true
        translateBtn.textContent = this.#startLabel
        translateBtn.onclick = () => this.#startAction()
    }



    findPossibleDNA(targetAaSequence){
        if(!targetAaSequence || targetAaSequence.length < 1){
            alert("Please enter a sequence.")
            return
        }

        targetAaSequence = targetAaSequence.toUpperCase()
        const targetLength = targetAaSequence.length
        let population = []
        let accuracy = 0
        this.#bestSoFar = undefined
        this.#currentGeneration = 1
        const loop = () =>{
            population = this.#nextPopulation(targetLength, population)
            accuracy = Math.max(accuracy, this.#calculateFitness(targetAaSequence, population))
            this.#showCandidates(targetAaSequence, accuracy, population)
            if(!this.#abort && accuracy < 1-this.#epsilon && ++this.#currentGeneration < this.#maxGenerations){
                window.setTimeout(loop, 0)
            }
            else {
                this.#stopAction()
            }
        }
        loop()
    }

    /**
     * calculates for each candidate in the population a normalised fitness score
     * @param {string} target the AA sequence we want to achieve
     * @param {Candidate[]} population the current candidates
     * 
     * @returns percentage of target symbols matched
     */
    #calculateFitness(target, population){
        const n = target.length

        let maxC = 0
        let sum = 0

        //score = amount of matching positions
        for(const p of population){
            const c = this.#countEqualPositions(target, p.aa)
            p.score = c
            sum += c
            maxC = Math.max(maxC, c)
        }

        //fitness = normalized score
        if(sum > 0){
            for(const p of population){
                p.fitness = p.score / sum
            }
        }else {
            for(const p of population){
                p.fitness = 1/population.length
            }
        }

        return maxC/n
    }

    /**
     * @param {string} target 
     * @param {string} candidateSequence 
     * @returns {number} the amount of positions in which the candidate matches the target exactly
     */
    #countEqualPositions(target, candidateSequence){
        if(target.length != candidateSequence.length){
            throw `candidate of length ${candidateSequence.length} is invalid for target of length ${target.length}`
        }

        let count = 0
        for(let i = 0; i < target.length; ++i){
            if(target[i] == candidateSequence[i]){
                ++count
            }
        }
        return count
    }

    /**
     * @param {number} targetLength the number of AA symbol characters the candidates should produce
     * @param {Candidate[]} oldPopulation 
     * @returns 
     */
    #nextPopulation(targetLength, oldPopulation){
        if(oldPopulation.length < this.#populationSize){
            return Array(this.#populationSize).fill(1).map(() => new Candidate(AaToDnaTranlator.#randomDna(targetLength)))
        }

        return Array(this.#populationSize).fill(1).map(() => {
            const a = weightedPick(oldPopulation, c => c.fitness)
            const b = weightedPick(oldPopulation, c => c.fitness)

            return this.#mate(a,b)
        })
    }

    /**
     * @param {Candidate} a 
     * @param {Candidate} b
     * @returns {Candidate} a mutated offspring of a and b 
     */
    #mate(a, b){
        const dnaA = a.dna
        const dnaB = b.dna
        if(dnaA.length != dnaB.length){
            throw `Candidates's DNA must have equal length`
        }

        const nofTriplets = a.aa.length
        const midpoint = randInt(nofTriplets)

        let childDNA = Array(nofTriplets).fill(1).map((_,i) => {
            const off = 3*i
            const parent = i < midpoint ? dnaA : dnaB
            return parent[off] + parent[off+1] + parent[off+2]
        }).join('')

        childDNA = this.#mutate(childDNA)

        return new Candidate(childDNA)
    }

    
    /**
     * @param {string} dna 
     * @returns {string} the mutated DNA
     */
    #mutate(dna){
        let mutatedDNA = dna
        for(let off =0; off <= dna.length - 3; off +=3){
            if(Math.random() < this.#mutationRate){
                const randomTriplet = AaToDnaTranlator.#randomDna(1)
                mutatedDNA = mutatedDNA.substr(0,off) + randomTriplet + mutatedDNA.substr(off+3, dna.length - off -3)
            }
        }
        if(mutatedDNA.length != dna.length){
            throw `expected mutated DNA to have same length as original`
        }
        return mutatedDNA
    }

    /**
     * replaces the displayed candidates with the new candidates
     * @param {Candidate[]} candidates the new candidates to display
     */
    #showCandidates(target, accuracy, candidates){
        this._shadow.querySelector('.result').style.display = 'flex'
        const visualisation = this._shadow.querySelector('.visualisation')
        while(visualisation.lastElementChild){
            visualisation.removeChild(visualisation.lastElementChild)
        }

        let bestCandidate = undefined
        for(const c of candidates){
            this.#showCandidate(c)
            if(!bestCandidate || bestCandidate.score < c.score){
                bestCandidate = c
            }
        }

        this.#updateStatistics(accuracy)
        this.#showBestCandidate(target, bestCandidate)
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
                overflow-wrap: anywhere;
            }
            .aa-sequence{
                color: black;
                overflow-wrap: anywhere;
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

    /**
     * @param {number} accuracy percentage of target positions that have ever been matched 
     */
    #updateStatistics(accuracy){
        const statistics = this._shadow.querySelector(".statistics")

        statistics.innerHTML = `
            <span>Generation: ${this.#currentGeneration}</span>
            <span>Best Match: ${(accuracy * 100).toFixed(2)}%
        `
    }

    /**
     * @param {string} target the AA sequence we want to produce
     * @param {Candidate} bestInGeneration 
     */
    #showBestCandidate(target, bestInGeneration){
        if(!this.#bestSoFar || bestInGeneration.score > this.#bestSoFar.score){
            this.#bestSoFar = bestInGeneration
        }

        const highlightedAa = this.#highlightDifferences(target, this.#bestSoFar.aa)
                
        const bestDisplay = this._shadow.querySelector(".best-candidate")
        bestDisplay.innerHTML = `
            <style>
                .best-dna,.best-aa {
                    overflow-wrap: anywhere;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                .best-aa {
                    font-weight: bold;
                }
                .best-aa .diff {
                    color: red;
                }
            </style>
            <div class="best-dna"><span>${this.#bestSoFar.dna}</span></div>
            <div class="best-aa">${highlightedAa}</div>
        `
    }

    /**
     * @param {string} target the sequence that needs be matched
     * @param {string} candidateSequence the sequence that was produced
     * @returns {string} a html string containing the candidate sequence where the symbols not matching the target
     * have a 'diff' class
     */
    #highlightDifferences(target, candidateSequence){
        let highlightedAa = ""
        let matching = true
        for(let i = 0, prev = 0; i <= candidateSequence.length; ++i){
            const isLast = i == candidateSequence.length
            const symbolMatches = !isLast && target[i] == candidateSequence[i]
            const modeChange = isLast || matching != symbolMatches

            if(modeChange){
                const currentGroup = candidateSequence.substr(prev, i-prev)
                prev = i
                if(matching){
                    highlightedAa += `<span>${currentGroup}</span>`
                }
                else {
                    highlightedAa += `<span class="diff">${currentGroup}</span>`
                }
                matching = !matching
            }
        }
        return highlightedAa
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
    static availableSymbols = ['A','T','G','C']

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

    /**
     * @param {number} targetLength number of triplets that should make up the DNA
     * @returns a random DNA 3*targetLength characters long
     */
    static #randomDna(targetLength){
        const availableTriplets = AaToDnaTranlator.availableTriplets
        const mapSize = availableTriplets.length
        const randomTriplets = Array(targetLength).fill(1).map(() => availableTriplets[randInt(mapSize)])
        return randomTriplets.join('')
    }
}

class Candidate{
    /**
     * @param {string} dna the DNA sequence of target candidate
     */
    constructor(dna){
        this.dna = dna
        this.aa = AaToDnaTranlator.dnaToAa(this.dna)
    }
}

window.customElements.define('aa-to-dna-translator', AaToDnaTranlator)