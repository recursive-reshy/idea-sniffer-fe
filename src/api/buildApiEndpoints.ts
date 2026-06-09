export const buildApiEndpoints = < T extends Record< string, string > >( endpoints: T ): T => {
  return Object.entries( endpoints )
    .reduce< Record< string, string > >( ( transformedEndpoints, [ key, value ] ) => {
        transformedEndpoints[ key ] = `${ import.meta.env.VITE_API_BASE_URL }/v${ import.meta.env.VITE_API_VERSION }/${ value }`

        return transformedEndpoints
      }, {}
    ) as T
}