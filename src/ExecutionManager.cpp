/*
 * ExecutionManager.cpp
 *
 *  Created on: Oct 9, 2014
 *      Author: root
 */

#include "ExecutionManager.h"
#include "Tests/LogWriter.h"
#include "Tests/FullTableScan.h"
#include "ConfigReader.h"

namespace DBBenchmark {

ExecutionManager::ExecutionManager() {
	// TODO Auto-generated constructor stub

}

ExecutionManager::~ExecutionManager() {
	// TODO Auto-generated destructor stub
}

HDDTest::ConfigGenerator ExecutionManager::initalizeLayout()
{
	// hdd starts at 0
		unsigned long long int size_start = 0;
		// spreading of relationship table
		unsigned long long int size_spread = 1024 * 1024 * 3;
		// size of a single extent
		unsigned long long int size_extent = 64;
		// size of a single page
		unsigned long long int size_page = 8;

		enum HDDTest::mode_readMode readMode;
		enum HDDTest::mode_extentDistribution extentDistribution;

		std::string device = "/dev/sdb";
		// define read mode: ORDERED or UNORDERED
		readMode = HDDTest::ORDERED;
		// distribution: EQUALLY or ED_RANDOM
		extentDistribution = HDDTest::EQUALLY;
		char no_of_relations = 3;
		char relation_distribution[] = {4,1,3,1,1,1,1,1}; // standard distribution of the relations


		/*if(argc <= 4) {
			std::cout << "Enter device address: " << std::flush;
			std::cin >> device;
		} else {
			device = std::string(argv[1]);
			readMode = (atoi(argv[2]) == 0) ? HDDTest::ORDERED : HDDTest::UNORDERED;
			extentDistribution = (atoi(argv[3]) == 0) ? HDDTest::EQUALLY : HDDTest::ED_RANDOM;
			no_of_relations = atoi(argv[4]);
		}*/

		HDDTest::ConfigGenerator confGen = HDDTest::ConfigGenerator(
											   size_start, size_spread,
											   size_extent, size_page, readMode,
											   extentDistribution, no_of_relations, relation_distribution);
		// generate configuration
		confGen.generate();

		return confGen;
}



void ExecutionManager::start()
{
	HDDTest::ConfigGenerator config = initalizeLayout();

	DBTest::FullTableScan tableScan = DBTest::FullTableScan();
	tableScan.setExtentSize(64);
	tableScan.setLayout(config.getExtentLocationsOfRel(1));
	//log.isEndless = true;
	tableScan.start();
}

} /* namespace DBBenchmark */