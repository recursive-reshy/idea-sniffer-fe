// React
import type { ReactNode } from 'react'
// MUI
import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import type { ListProps } from '@mui/material'

interface Tag {
  label: string
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

interface ListItemWithMeta {
  avatar?: ReactNode | string
  primary: string
  tags?: Tag[]
  secondary?: string
  meta?: string[]
  action?: ReactNode
}

type Props = {
  listItems: ListItemWithMeta[]
} & ListProps

function ListItemsWithMeta( { listItems, ...rest }: Props) {
  return (
    <List
      { ...rest }
    >
      { listItems.map( ( { avatar, primary, tags, secondary, meta, action }, index ) => (
          <ListItem key={ index } secondaryAction={ action ?? undefined }>
            { avatar && 
              <ListItemAvatar>
                <Avatar>{ avatar }</Avatar>
              </ListItemAvatar>
            }
            <ListItemText
              primary={ primary }
              secondary={
                <>
                  { tags && <Stack direction="row" spacing={ 1 } sx={ { mt: 1, mb: 1 } }>
                      { tags.map( ( tag, index ) => (
                          <Chip 
                            key={ index } 
                            size="small"
                            { ...tag }
                          />
                        ) ) 
                      }
                    </Stack>
                  }
                  { secondary && 
                    <Typography variant="body2">
                      { secondary }
                    </Typography>
                  }
                  { meta && 
                    <Typography key={ index } variant="caption">
                      { meta.join(' | ') }
                    </Typography>
                  }
                </>
              }
            />
          </ListItem>
        ) )
      }
    </List>
  )
}

export default ListItemsWithMeta