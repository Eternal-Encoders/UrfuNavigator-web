import "./name-institute.css"

interface NameInstituteProps {
    name: string,
    isActive: boolean,
}

function NameInstitute({ name, isActive }: NameInstituteProps) {
    const activeStyles = {
        color: "#FFFFFF"
    }

    const nonActiveStyles = {
        color: "#6D6D6D"
    }

    return (
        <h1 className="ins-name" style={ isActive ? nonActiveStyles : activeStyles }>{ name }</h1>
    )
}

export default NameInstitute;