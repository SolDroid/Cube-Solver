import * as THREE from "./packages/three.module.js"

// Rubik's cube class
export default class Cube {
    constructor(dimension, x = 0, y = 0) {
        this.Pos = THREE.Vector2(x, y)
        this.Dimension = dimension

        // Array of every sides individual faces
        this.Sides = []

        // Dictionary of cube notation
        this.Names = {
            F: 'front',
            B: 'back',
            L: 'left',
            R: 'right',
            U: 'up',
            D: 'down'
        }

        // Colour values for the cube
        this.Colours = {
            G: 0xACF39D,
            B: 0x92D5E6,
            R: 0xF45B69,
            O: 0xFF934F,
            Y: 0xFFFF82,
            W: 0xFAFAFA
        }
    }

    // Builds cube mesh
    build() {
        for (let s = 0; s < 6; s++) {
            let side = {
                name: this.Names[s],
                faces: []
            }

            for (let x = 0; x < this.Dimension; x++) {
                for (let y = 0; y < this.Dimension; y++) {
                    colour = this.Colours[s]
                    side.faces.push(colour)
                }
            }

            this.Sides.push(side)
        }
    }
}