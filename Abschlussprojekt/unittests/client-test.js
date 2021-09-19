const chai = window.chai
const expect = chai.expect //https://www.chaijs.com

console.log()

describe ("our Unittests", () =>
{
    it ("should return an appropriate value for sums", () =>
    {
        expect(sum(2, 3)).to.equal(5)
    })

    it ("should return an appropriate value for multiplications", () => 
    {
        expect(multiply(2, 9)).to.equal(18)
    })

    it("should return an appropriate value for subtractions", () => 
    {
        expect(subtract(20, 10)).to.equal(10)
    })

    it ("should return an appropriate value for title determination", () =>
    {
        expect(getTitle(url)).to.equal('St.-Paulus-Dom_(M%C3%BCnster)')
    })

    it ("should return an appropriate value for file extension check", () =>
    {
        expect(isGeoJSON(testdatei)).to.equal(true)
    })
})




