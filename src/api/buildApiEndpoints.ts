export const buildApiEndpoints = < T extends Record< string, string > >( endpoints: T ): T => {
  return Object.entries( endpoints )
    .reduce( ( transformedEndpoints, [ key, value ] ) => {
        transformedEndpoints[ key ] = `${ import.meta.env.VITE_API_BASE_URL }/${ import.meta.env.VITE_API_VERSION }/${ value }`

        return transformedEndpoints
      }, {}
    ) as T
}