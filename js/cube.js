import * as THREE from "./packages/three.module.js"

// Rubik's cube class
export default class Cube {
    constructor(dimension, x = 0, y = 0) {
        this.Pos = new THREE.Vector2(x, y)
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

        // Maps colour values to numbers
        this.ColourMap = ['G', 'B', 'R', 'O', 'Y', 'W']
        // Maps face names to numbers
        this.NameMap = ['F', 'B', 'L', 'R', 'U', 'D']

        // Base object for faces
        this.Node = new THREE.Object3D()
    }

    // Builds cube mesh
    build() {
        let index = 0
        for (const name in this.Names) {
            let side = {
                name: name,
                faces: []
            }


            for (let y = 0; y < this.Dimension; y++) {
                for (let x = 0; x < this.Dimension; x++) {
                    side.faces.push({
                        colour: this.Colours[this.ColourMap[index]],
                        x: x,
                        y: y
                    })
                }
            }

            this.Sides.push(side)

            index++
        }

        return this.Sides
    }

    // Creates meshes from sides array
    generateMesh() {
        let size = 1
        let faceSize = size / this.Dimension
        let spacing = faceSize * 0.1

        let coreGeo = new THREE.BoxGeometry(size - 0.001, size - 0.001, size - 0.001)
        let coreMat = new THREE.MeshBasicMaterial({
            color: 0x212121
        })
        let core = new THREE.Mesh(coreGeo, coreMat)

        this.Node.add(core)

        // Maps side names to axises and directions for rotations and translations
        let transforms = {
            F: {
                rot: 'flip',
                trans: 'z',
                dir: -1
            },
            B: {
                rot: 'none',
                trans: 'z',
                dir: 1
            },
            L: {
                rot: 'y',
                trans: 'x',
                dir: 1
            },
            R: {
                rot: 'y',
                trans: 'x',
                dir: -1
            },
            U: {
                rot: 'x',
                trans: 'y',
                dir: 1
            },
            D: {
                rot: 'x',
                trans: 'y',
                dir: -1
            }
        }

        this.Sides.forEach(side => {
            let rot = new THREE.Vector3(0, 0, 0)
            let trans = new THREE.Vector3(0, 0, 0)

            if (transforms[side.name].rot == 'x') rot.x = Math.PI / 2 * transforms[side.name].dir
            else if (transforms[side.name].rot == 'y') rot.y = Math.PI / 2 * transforms[side.name].dir
            else if (transforms[side.name].rot == 'flip') rot.x = Math.PI * transforms[side.name].dir

            if (transforms[side.name].trans == 'x') trans.x = transforms[side.name].dir * (size / 2)
            else if (transforms[side.name].trans == 'y') trans.y = transforms[side.name].dir * (size / 2)
            else if (transforms[side.name].trans == 'z') trans.z = transforms[side.name].dir * (size / 2)

            side.faces.forEach(face => {
                let shift = Math.floor(this.Dimension / 2)

                let xPos
                let yPos

                // Calculate offset for even or odd cube
                if (this.Dimension % 2 == 0) {
                    xPos = face.x / this.Dimension - 0.5 + faceSize / 2
                    yPos = face.y / this.Dimension - 0.5 + faceSize / 2
                } else {
                    xPos = (face.x - shift) * faceSize
                    yPos = (face.y - shift) * faceSize
                }

                let offset

                if (transforms[side.name].rot == "none" || transforms[side.name].rot == "flip") offset = new THREE.Vector3(xPos, yPos, 0)
                else if (transforms[side.name].rot == "y") offset = new THREE.Vector3(0, yPos, xPos)
                else if (transforms[side.name].rot == "x") offset = new THREE.Vector3(xPos, 0, yPos)

                let plane = new THREE.PlaneGeometry(faceSize - spacing, faceSize - spacing)

                plane.rotateX(rot.x)
                plane.rotateY(rot.y)
                plane.rotateZ(rot.z)

                plane.translate(trans.x + offset.x, trans.y + offset.y, trans.z + offset.z)

                let mat = new THREE.MeshBasicMaterial({
                    color: face.colour,
                    side: THREE.DoubleSide
                })

                let mesh = new THREE.Mesh(plane, mat)

                this.Node.add(mesh)

                plane.dispose()
                mat.dispose()
            })
        })

        return this.Node
    }
}