

export const hasProperty = (properties: {[key:string]: string}, hasProperty?: string) => {
    if (!hasProperty) {return true}
    var artifactWithProperty = true;
    hasProperty.split(',').forEach((prop) => {
        const [key, value ] = prop.split(':')
        if (!properties[key] || properties[key] !== value) {
            artifactWithProperty = false;
        }
    })
    return artifactWithProperty
}