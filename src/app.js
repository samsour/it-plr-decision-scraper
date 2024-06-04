import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
    Stat,
    Button,
  StatNumber,
  StatHelpText,
Badge,
  Stack
} from '@chakra-ui/react';
import { debounce } from 'lodash';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('available_links.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const handleFilterChange = useCallback(
    debounce((event) => {
      setFilter(event.target.value.toLowerCase());
    }, 300),
    []
  );

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return (
        item.url.toLowerCase().includes(filter) ||
        item.headline.toLowerCase().includes(filter) ||
        (item.meeting_info.meeting_type || '').toLowerCase().includes(filter) ||
        (item.meeting_info.date || '').toLowerCase().includes(filter) ||
        (item.meeting_info.session || '').toLowerCase().includes(filter) ||
        (item.meeting_info.decision || '').toLowerCase().includes(filter)
      );
    });
  }, [data, filter]);

  return (
    <Container maxW="container.xl" py={4}>
      <Heading as="h1" mb={4}>Verfügbare Beschlüsse</Heading>
      <VStack spacing={4} align="stretch" mb={4}>
        <Box>
          <Input
            type="text"
            id="filter"
            placeholder="Suchen"
            onChange={handleFilterChange}
            fontSize="2xl"
            p={4}
          />
        </Box>
      </VStack>


      <Box overflowX="auto">
        
        <Accordion allowToggle>
          {filteredData.reverse().map((item, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Stack direction='row'>
                        <Badge colorScheme='green'>{item.meeting_info.decision}</Badge>
                        <Badge colorScheme='red'>{item.meeting_info.meeting_type}</Badge>
                        <Badge colorScheme='purple'>{item.meeting_info.session}</Badge>
                    </Stack>
                    <Stat>
                        <StatNumber>{item.headline}</StatNumber>
                        <StatHelpText>{item.meeting_info.date}</StatHelpText>
                    </Stat>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Button href={item.url} target="_blank" rel="noopener noreferrer" colorScheme='teal' variant='outline'>
                    Zur Seite
                </Button>
                <div dangerouslySetInnerHTML={{ __html: item.article_html }} />
              </AccordionPanel>

            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Container>
  );
}

export default App;