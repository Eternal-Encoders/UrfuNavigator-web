import style from './name-institute.module.css'

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
        <h1 className={style.insName} style={ isActive ? nonActiveStyles : activeStyles }>{ name }</h1>
    )
}

export default NameInstitute;