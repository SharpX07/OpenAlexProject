import React from 'react';

export interface QueryResult {
    type: 'work';
    principal_value: string;
    secondary_value: string;
    tertiary_value: string;
    id: string;
}

interface QueryResultsProps {
    results: QueryResult[];
    type: 'work' | 'author' | 'institution';
    onClickItem: (id: string, type: string) => void;
}

export const QueryResults: React.FC<QueryResultsProps> = ({ results, type , onClickItem}) => {
    if (results.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

    return (
        <ul>
            {results.map((result, index) => {
                return (
                    <li className='bg-white hover:bg-[#d5bdaf] rounded-lg p-4 m-2 border border-[#d5bdaf]
                    ' key={index} onClick={() => onClickItem(result.id, type)}>
                        <h3>{result.principal_value}</h3>
                        <p>Fecha de publicación: {result.secondary_value}</p>
                        <p>Idioma: {result.tertiary_value}</p>
                        {/* <p>Idioma: {result.id}</p> */}
                        {/* <p>Resumen: {result.abstract}</p> */}
                    </li>
                );

                // if (type === "author" && 'display_name' in result) {
                //     // Aquí podemos asegurar que result es un AuthorResult
                //     return (
                //         <li key={index}>
                //             <h3>{result.display_name}</h3>
                //             <p>Obras: {result.works_count}</p>
                //             <p>Citado por: {result.cited_by_count}</p>
                //             <p>Afilaciones: {result.affiliations.join(", ")}</p>
                //             <p>Intereses de investigación: {result.research_interests.join(", ")}</p>
                //         </li>
                //     );
                // }

                // if (type === "institution" && 'display_name' in result) {
                //     // Aquí podemos asegurar que result es un InstitutionResult
                //     return (
                //         <li key={index}>
                //             <h3>{result.display_name}</h3>
                //             <p>Obras: {result.works_count}</p>
                //             <p>Citado por: {result.cited_by_count}</p>
                //             <p>Afilaciones: {result.affiliations.join(", ")}</p>
                //             <p>Intereses de investigación: {result.research_interests.join(", ")}</p>
                //         </li>
                //     );
                // }

                // Si no se cumple ninguna condición, retornamos null
                return null;
            })}
        </ul>
    );
};
